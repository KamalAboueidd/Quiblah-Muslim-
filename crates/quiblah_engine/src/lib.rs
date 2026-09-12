//! Quiblah Muslim Engine (قبلة المسلم)
//! High-performance astronomical, geodesic, and Quranic recitation computational engine.
//!
//! # Features
//! - Sub-microsecond astronomical prayer times calculation.
//! - Great-circle geodesic forward azimuth to Holy Kaaba.
//! - Dynamic Needleman-Wunsch Arabic Quranic phonetics alignment.

pub mod astronomy;
pub mod geodesic;
pub mod phonetics;

pub use astronomy::{AstronomicalEngine, CalculationMethod, AsrJuristic, DailyPrayerTimes};
pub use geodesic::{GeodesicEngine, QiblaResult};
pub use phonetics::{PhoneticsEngine, RecitationReport, AlignmentType};
