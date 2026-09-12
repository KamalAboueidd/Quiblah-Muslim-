use std::env;
use std::time::Instant;
use quiblah_engine::{
    AstronomicalEngine, CalculationMethod, AsrJuristic,
    GeodesicEngine, PhoneticsEngine, AlignmentType,
};

fn print_banner() {
    println!("========================================================");
    println!("  Quiblah Muslim (قبلة المسلم) - Rust Native Core Engine");
    println!("  High-Precision Astronomical, Geodesic & Phonetics Suite");
    println!("========================================================");
}

fn print_usage() {
    print_banner();
    println!("Usage:");
    println!("  quiblah-cli prayer [lat] [lng] [timezone]");
    println!("  quiblah-cli qibla [lat] [lng]");
    println!("  quiblah-cli recite \"<expected verse>\" \"<recited words>\"");
    println!("  quiblah-cli bench");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        print_usage();
        return;
    }

    match args[1].as_str() {
        "prayer" => {
            let lat = args.get(2).and_then(|s| s.parse::<f64>().ok()).unwrap_or(30.0444); // Cairo default
            let lng = args.get(3).and_then(|s| s.parse::<f64>().ok()).unwrap_or(31.2357);
            let tz = args.get(4).and_then(|s| s.parse::<f64>().ok()).unwrap_or(2.0);

            let engine = AstronomicalEngine::new(
                CalculationMethod::EgyptianGeneralAuthority,
                AsrJuristic::Standard,
            );

            let now = Instant::now();
            let times = engine.calculate(lat, lng, tz, 2026, 9, 12);
            let duration = now.elapsed();

            print_banner();
            println!("Coordinates: Lat {:.4}, Lng {:.4} (Timezone UTC+{})", lat, lng, tz);
            println!("Computation Time: {:?}", duration);
            println!("--------------------------------------------------------");
            for (prayer, time_str) in times.to_string_map() {
                println!("  {: <10} : {}", prayer, time_str);
            }
        }
        "qibla" => {
            let lat = args.get(2).and_then(|s| s.parse::<f64>().ok()).unwrap_or(30.0444);
            let lng = args.get(3).and_then(|s| s.parse::<f64>().ok()).unwrap_or(31.2357);

            let now = Instant::now();
            let qibla = GeodesicEngine::calculate_qibla(lat, lng);
            let duration = now.elapsed();

            print_banner();
            println!("Coordinates: Lat {:.4}, Lng {:.4}", lat, lng);
            println!("Computation Time: {:?}", duration);
            println!("--------------------------------------------------------");
            println!("  Qibla Bearing : {:.2}°", qibla.bearing_degrees);
            println!("  Distance      : {:.1} km ({:.1} miles)", qibla.distance_km, qibla.distance_miles);
            println!("  Direction     : {}", qibla.cardinal_heading);
        }
        "recite" => {
            let expected_text = args.get(2).cloned().unwrap_or_else(|| "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ".to_string());
            let recited_text = args.get(3).cloned().unwrap_or_else(|| "بسم الله الرحمن العظيم".to_string());

            let expected_words: Vec<&str> = expected_text.split_whitespace().collect();
            let recited_words: Vec<&str> = recited_text.split_whitespace().collect();

            let now = Instant::now();
            let report = PhoneticsEngine::align(&expected_words, &recited_words);
            let duration = now.elapsed();

            print_banner();
            println!("Recitation Evaluation (Time: {:?}):", duration);
            println!("Accuracy Score: {}%", report.accuracy_percentage);
            println!("Stats: {} Correct, {} Errors, {} Missing, {} Extra",
                report.correct_count, report.mismatch_count, report.missing_count, report.extra_count);
            println!("--------------------------------------------------------");
            for w in report.words {
                match w.alignment_type {
                    AlignmentType::Match => println!("  [✓ MATCH]    {}", w.expected.unwrap_or_default()),
                    AlignmentType::Mismatch => println!("  [✕ MISMATCH] Recited: \"{}\" -> Expected: \"{}\"",
                        w.recited.unwrap_or_default(), w.expected.unwrap_or_default()),
                    AlignmentType::Missing => println!("  [- MISSING]  Expected: \"{}\"", w.expected.unwrap_or_default()),
                    AlignmentType::Extra => println!("  [+ EXTRA]    Recited: \"{}\"", w.recited.unwrap_or_default()),
                }
            }
        }
        "bench" => {
            print_banner();
            println!("Benchmarking 1,000,000 Astronomical Prayer Time Calculations...");

            let engine = AstronomicalEngine::default();
            let start = Instant::now();
            let iterations = 1_000_000;

            for i in 0..iterations {
                let day = (i % 28) + 1;
                let _ = engine.calculate(30.0444, 31.2357, 2.0, 2026, 9, day as u32);
            }

            let duration = start.elapsed();
            let per_calc = duration.as_nanos() as f64 / iterations as f64;
            let throughput = (iterations as f64 / duration.as_secs_f64()).round();

            println!("Completed: {} calculations in {:.2?}", iterations, duration);
            println!("Latency:   {:.2} ns per calculation", per_calc);
            println!("Throughput: {:.0} calculations / second", throughput);
        }
        _ => {
            print_usage();
        }
    }
}
