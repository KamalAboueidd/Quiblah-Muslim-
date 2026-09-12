//! High-precision Islamic Astronomical Calculations Engine
//! Computes exact prayer times (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
//! using spherical solar astronomy, Julian epoch calculations, and atmospheric refraction.

use std::f64::consts::PI;

/// Standard calculation methods for Fajr and Isha angles
#[derive(Debug, Clone, Copy)]
pub enum CalculationMethod {
    EgyptianGeneralAuthority, // Fajr: 19.5°, Isha: 17.5°
    UmmAlQuraMakkah,          // Fajr: 18.5°, Isha: 90 min after Maghrib
    MuslimWorldLeague,        // Fajr: 18.0°, Isha: 17.0°
    IslamicSocietyNorthAmerica,// Fajr: 15.0°, Isha: 15.0°
}

/// Asr juristic calculation methods
#[derive(Debug, Clone, Copy)]
pub enum AsrJuristic {
    Standard, // Shafi'i, Maliki, Hanbali (Shadow length = 1)
    Hanafi,   // Hanafi (Shadow length = 2)
}

/// Prayer times representation for a single calendar day
#[derive(Debug, Clone)]
pub struct DailyPrayerTimes {
    pub fajr: (u8, u8, u8),
    pub sunrise: (u8, u8, u8),
    pub dhuhr: (u8, u8, u8),
    pub asr: (u8, u8, u8),
    pub maghrib: (u8, u8, u8),
    pub isha: (u8, u8, u8),
}

impl DailyPrayerTimes {
    pub fn to_string_map(&self) -> Vec<(&'static str, String)> {
        vec![
            ("Fajr", format!("{:02}:{:02}", self.fajr.0, self.fajr.1)),
            ("Sunrise", format!("{:02}:{:02}", self.sunrise.0, self.sunrise.1)),
            ("Dhuhr", format!("{:02}:{:02}", self.dhuhr.0, self.dhuhr.1)),
            ("Asr", format!("{:02}:{:02}", self.asr.0, self.asr.1)),
            ("Maghrib", format!("{:02}:{:02}", self.maghrib.0, self.maghrib.1)),
            ("Isha", format!("{:02}:{:02}", self.isha.0, self.isha.1)),
        ]
    }
}

/// Astronomical Solar Engine
pub struct AstronomicalEngine {
    pub method: CalculationMethod,
    pub juristic: AsrJuristic,
}

impl Default for AstronomicalEngine {
    fn default() -> Self {
        Self {
            method: CalculationMethod::EgyptianGeneralAuthority,
            juristic: AsrJuristic::Standard,
        }
    }
}

impl AstronomicalEngine {
    pub fn new(method: CalculationMethod, juristic: AsrJuristic) -> Self {
        Self { method, juristic }
    }

    /// Converts degrees to radians
    #[inline]
    fn deg_to_rad(d: f64) -> f64 {
        d * (PI / 180.0)
    }

    /// Converts radians to degrees
    #[inline]
    fn rad_to_deg(r: f64) -> f64 {
        r * (180.0 / PI)
    }

    /// Computes Julian Day from Gregorian date
    pub fn julian_day(year: i32, month: u32, day: u32) -> f64 {
        let (y, m) = if month <= 2 {
            (year - 1, month + 12)
        } else {
            (year, month)
        };

        let a = (y as f64 / 100.0).floor();
        let b = 2.0 - a + (a / 4.0).floor();

        (365.25 * (y as f64 + 4716.0)).floor()
            + (30.6001 * (m as f64 + 1.0)).floor()
            + day as f64
            + b
            - 1524.5
    }

    /// Calculates Solar coordinates (Declination, Equation of Time)
    pub fn solar_coordinates(jd: f64) -> (f64, f64) {
        let d = jd - 2451545.0;
        let g = Self::deg_to_rad(Self::fix_angle(357.529 + 0.98560028 * d));
        let q = Self::deg_to_rad(Self::fix_angle(280.459 + 0.98564736 * d));
        let l = Self::deg_to_rad(Self::fix_angle(
            Self::rad_to_deg(q) + 1.915 * g.sin() + 0.020 * (2.0 * g).sin(),
        ));

        let e = Self::deg_to_rad(23.439 - 0.00000036 * d);
        let declination = (e.sin() * l.sin()).asin();

        let ra = (e.cos() * l.sin()).atan2(l.cos()) / 15.0;
        let ra_deg = Self::fix_hour(Self::rad_to_deg(ra));
        let eq_time = Self::rad_to_deg(q) / 15.0 - ra_deg;

        (declination, eq_time)
    }

    #[inline]
    fn fix_angle(a: f64) -> f64 {
        let rem = a % 360.0;
        if rem < 0.0 { rem + 360.0 } else { rem }
    }

    #[inline]
    fn fix_hour(h: f64) -> f64 {
        let rem = h % 24.0;
        if rem < 0.0 { rem + 24.0 } else { rem }
    }

    /// Calculates hour angle for a given altitude angle
    fn hour_angle(lat: f64, declination: f64, altitude: f64) -> Option<f64> {
        let lat_r = Self::deg_to_rad(lat);
        let alt_r = Self::deg_to_rad(altitude);

        let cos_ha = (alt_r.sin() - lat_r.sin() * declination.sin())
            / (lat_r.cos() * declination.cos());

        if cos_ha < -1.0 || cos_ha > 1.0 {
            None
        } else {
            Some(Self::rad_to_deg(cos_ha.acos()) / 15.0)
        }
    }

    /// Calculates prayer times for a geographical coordinate
    pub fn calculate(
        &self,
        lat: f64,
        lng: f64,
        timezone: f64,
        year: i32,
        month: u32,
        day: u32,
    ) -> DailyPrayerTimes {
        let jd = Self::julian_day(year, month, day);
        let (decl, eq_t) = Self::solar_coordinates(jd);

        // Solar Noon (Dhuhr)
        let dhuhr_h = Self::fix_hour(12.0 + timezone - (lng / 15.0) - eq_t);

        // Sunrise & Sunset (Altitude: -0.833° for atmospheric refraction)
        let sunrise_ha = Self::hour_angle(lat, decl, -0.833).unwrap_or(6.0);
        let sunrise_h = dhuhr_h - sunrise_ha;
        let maghrib_h = dhuhr_h + sunrise_ha;

        // Fajr & Isha angles
        let (fajr_angle, isha_angle) = match self.method {
            CalculationMethod::EgyptianGeneralAuthority => (19.5, 17.5),
            CalculationMethod::UmmAlQuraMakkah => (18.5, 18.0),
            CalculationMethod::MuslimWorldLeague => (18.0, 17.0),
            CalculationMethod::IslamicSocietyNorthAmerica => (15.0, 15.0),
        };

        let fajr_ha = Self::hour_angle(lat, decl, -fajr_angle).unwrap_or(7.0);
        let fajr_h = dhuhr_h - fajr_ha;

        let isha_h = match self.method {
            CalculationMethod::UmmAlQuraMakkah => maghrib_h + 1.5, // 90 min after Maghrib
            _ => {
                let isha_ha = Self::hour_angle(lat, decl, -isha_angle).unwrap_or(7.0);
                dhuhr_h + isha_ha
            }
        };

        // Asr Calculation based on shadow multiplier
        let shadow_mult = match self.juristic {
            AsrJuristic::Standard => 1.0,
            AsrJuristic::Hanafi => 2.0,
        };
        let lat_r = Self::deg_to_rad(lat);
        let asr_alt = (shadow_mult + (lat_r - decl).abs().tan()).recip().atan();
        let asr_ha = Self::hour_angle(lat, decl, Self::rad_to_deg(asr_alt)).unwrap_or(3.0);
        let asr_h = dhuhr_h + asr_ha;

        DailyPrayerTimes {
            fajr: Self::decimal_to_hms(fajr_h),
            sunrise: Self::decimal_to_hms(sunrise_h),
            dhuhr: Self::decimal_to_hms(dhuhr_h),
            asr: Self::decimal_to_hms(asr_h),
            maghrib: Self::decimal_to_hms(maghrib_h),
            isha: Self::decimal_to_hms(isha_h),
        }
    }

    #[inline]
    fn decimal_to_hms(decimal_h: f64) -> (u8, u8, u8) {
        let norm = Self::fix_hour(decimal_h);
        let h = norm.floor() as u8;
        let rem_m = (norm - h as f64) * 60.0;
        let m = rem_m.floor() as u8;
        let s = ((rem_m - m as f64) * 60.0).round() as u8;
        (h, m, s.min(59))
    }
}
