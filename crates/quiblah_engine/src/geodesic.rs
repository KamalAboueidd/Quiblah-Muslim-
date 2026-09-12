//! High-precision Geodesic Qibla Direction & Distance Engine
//! Implements great-circle forward azimuth and spherical trigonometric navigation
//! toward the Holy Kaaba in Mecca (21.4225° N, 39.8262° E).

use std::f64::consts::PI;

pub const KAABA_LAT: f64 = 21.4225;
pub const KAABA_LNG: f64 = 39.8262;
pub const EARTH_RADIUS_KM: f64 = 6371.0;

#[derive(Debug, Clone)]
pub struct QiblaResult {
    pub latitude: f64,
    pub longitude: f64,
    pub bearing_degrees: f64,
    pub distance_km: f64,
    pub distance_miles: f64,
    pub cardinal_heading: &'static str,
}

pub struct GeodesicEngine;

impl GeodesicEngine {
    #[inline]
    fn deg_to_rad(deg: f64) -> f64 {
        deg * (PI / 180.0)
    }

    #[inline]
    fn rad_to_deg(rad: f64) -> f64 {
        rad * (180.0 / PI)
    }

    /// Computes great-circle forward azimuth (Qibla bearing) from coordinates
    pub fn calculate_qibla(lat: f64, lng: f64) -> QiblaResult {
        let lat1 = Self::deg_to_rad(lat);
        let lng1 = Self::deg_to_rad(lng);
        let lat2 = Self::deg_to_rad(KAABA_LAT);
        let lng2 = Self::deg_to_rad(KAABA_LNG);

        let d_lng = lng2 - lng1;

        // Forward Azimuth formula:
        // θ = atan2( sin Δλ cos φ2 , cos φ1 sin φ2 − sin φ1 cos φ2 cos Δλ )
        let y = d_lng.sin() * lat2.cos();
        let x = lat1.cos() * lat2.sin() - lat1.sin() * lat2.cos() * d_lng.cos();
        let bearing_raw = Self::rad_to_deg(y.atan2(x));
        let bearing = (bearing_raw + 360.0) % 360.0;

        // Haversine distance formula:
        let d_lat = lat2 - lat1;
        let a = (d_lat / 2.0).sin().powi(2)
            + lat1.cos() * lat2.cos() * (d_lng / 2.0).sin().powi(2);
        let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());
        let dist_km = EARTH_RADIUS_KM * c;

        QiblaResult {
            latitude: lat,
            longitude: lng,
            bearing_degrees: (bearing * 100.0).round() / 100.0,
            distance_km: (dist_km * 10.0).round() / 10.0,
            distance_miles: ((dist_km * 0.621371) * 10.0).round() / 10.0,
            cardinal_heading: Self::bearing_to_cardinal(bearing),
        }
    }

    /// Converts azimuth angle into 16-point compass cardinal direction
    pub fn bearing_to_cardinal(deg: f64) -> &'static str {
        let directions = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
        ];
        let idx = (((deg + 11.25) % 360.0) / 22.5).floor() as usize;
        directions[idx % 16]
    }
}
