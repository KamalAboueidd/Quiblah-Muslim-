//! High-performance Quranic Recitation Phonetics & Alignment Engine
//! Implements global sequence alignment (Needleman-Wunsch) and Arabic phonetic normalization
//! for real-time word-by-word Quran verification.

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum AlignmentType {
    Match,
    Mismatch,
    Missing,
    Extra,
}

#[derive(Debug, Clone)]
pub struct AlignedWord {
    pub alignment_type: AlignmentType,
    pub expected: Option<String>,
    pub recited: Option<String>,
}

#[derive(Debug, Clone)]
pub struct RecitationReport {
    pub accuracy_percentage: u32,
    pub total_expected: usize,
    pub correct_count: usize,
    pub mismatch_count: usize,
    pub missing_count: usize,
    pub extra_count: usize,
    pub words: Vec<AlignedWord>,
}

pub struct PhoneticsEngine;

impl PhoneticsEngine {
    /// Strips Arabic Quranic diacritics and normalizes letter variations
    pub fn normalize_arabic(text: &str) -> String {
        let mut out = String::with_capacity(text.len());

        for ch in text.chars() {
            match ch {
                // Ignore Tashkeel / Harakat & Quranic marks
                '\u{064B}'..='\u{065F}' | '\u{06D6}'..='\u{06ED}' | '\u{0670}' | '\u{0640}' => continue,
                // Normalize all Alef variants to bare Alef
                '\u{0671}' | 'أ' | 'إ' | 'آ' => out.push('ا'),
                // Normalize Yeh / Alef Maksura
                'ى' | '\u{06CC}' => out.push('ي'),
                // Normalize Teh Marbuta to Heh
                'ة' => out.push('ه'),
                // Normalize Hamza on Waw / Yeh
                'ؤ' => out.push('و'),
                'ئ' => out.push('ي'),
                // Keep standard Arabic letters and whitespace
                c if ('\u{0621}'..='\u{064A}').contains(&c) || c.is_whitespace() => out.push(c),
                _ => continue,
            }
        }

        out.split_whitespace().collect::<Vec<&str>>().join(" ")
    }

    /// Determines if two Arabic words match phonetically with Quranic variations
    pub fn are_words_matching(expected: &str, recited: &str) -> bool {
        if expected.is_empty() || recited.is_empty() {
            return false;
        }

        let e_norm = Self::normalize_arabic(expected);
        let r_norm = Self::normalize_arabic(recited);

        if e_norm == r_norm {
            return true;
        }

        // Handle dagger alef omission (e.g. الرحمن vs الرحمان, مالك vs ملك)
        let e_with_alef = Self::normalize_arabic(&expected.replace('\u{0670}', "ا"));
        if e_with_alef == r_norm {
            return true;
        }

        if e_norm.len() >= 4 && e_norm.replace('ا', "") == r_norm.replace('ا', "") {
            return true;
        }

        false
    }

    /// Needleman-Wunsch global dynamic sequence alignment for word-by-word comparison
    pub fn align(expected_words: &[&str], recited_words: &[&str]) -> RecitationReport {
        let n = expected_words.len();
        let m = recited_words.len();

        let mut dp = vec![vec![0i32; m + 1]; n + 1];

        for i in 0..=n {
            dp[i][0] = -(i as i32) * 2;
        }
        for j in 0..=m {
            dp[0][j] = -(j as i32) * 2;
        }

        for i in 1..=n {
            let e_word = expected_words[i - 1];
            for j in 1..=m {
                let r_word = recited_words[j - 1];
                let is_match = Self::are_words_matching(e_word, r_word);
                let match_score = if is_match { 3 } else { -1 };

                let diag = dp[i - 1][j - 1] + match_score;
                let delete = dp[i - 1][j] - 2;
                let insert = dp[i][j - 1] - 2;

                dp[i][j] = diag.max(delete).max(insert);
            }
        }

        let mut i = n;
        let mut j = m;
        let mut aligned_words = Vec::new();

        while i > 0 || j > 0 {
            if i > 0 && j > 0 {
                let e_word = expected_words[i - 1];
                let r_word = recited_words[j - 1];
                let is_match = Self::are_words_matching(e_word, r_word);
                let match_score = if is_match { 3 } else { -1 };

                if dp[i][j] == dp[i - 1][j - 1] + match_score {
                    aligned_words.push(AlignedWord {
                        alignment_type: if is_match {
                            AlignmentType::Match
                        } else {
                            AlignmentType::Mismatch
                        },
                        expected: Some(e_word.to_string()),
                        recited: Some(r_word.to_string()),
                    });
                    i -= 1;
                    j -= 1;
                    continue;
                }
            }

            if i > 0 && (j == 0 || dp[i][j] == dp[i - 1][j] - 2) {
                aligned_words.push(AlignedWord {
                    alignment_type: AlignmentType::Missing,
                    expected: Some(expected_words[i - 1].to_string()),
                    recited: None,
                });
                i -= 1;
            } else if j > 0 {
                aligned_words.push(AlignedWord {
                    alignment_type: AlignmentType::Extra,
                    expected: None,
                    recited: Some(recited_words[j - 1].to_string()),
                });
                j -= 1;
            } else {
                break;
            }
        }

        aligned_words.reverse();

        let mut correct = 0;
        let mut mismatch = 0;
        let mut missing = 0;
        let mut extra = 0;

        for w in &aligned_words {
            match w.alignment_type {
                AlignmentType::Match => correct += 1,
                AlignmentType::Mismatch => mismatch += 1,
                AlignmentType::Missing => missing += 1,
                AlignmentType::Extra => extra += 1,
            }
        }

        let total_denom = (n.max(correct + mismatch + missing)).max(1);
        let accuracy = ((correct as f64 / total_denom as f64) * 100.0).round() as u32;

        RecitationReport {
            accuracy_percentage: accuracy,
            total_expected: n,
            correct_count: correct,
            mismatch_count: mismatch,
            missing_count: missing,
            extra_count: extra,
            words: aligned_words,
        }
    }
}
