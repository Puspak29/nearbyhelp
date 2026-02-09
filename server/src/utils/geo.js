exports.toMeters = (distance, unit = 'km') => {
    switch(unit){
        case 'm':
            return distance;
        case 'mi':
            return distance * 1609.34;
        case 'km':
        default:
            return distance * 1000;
    }
}

exports.buildNearQuery = (longitude, latitude, distance, unit = 'km') => {
    const lng = Number(longitude);
    const lat = Number(latitude);
    const distanceInMeters = this.toMeters(distance, unit);

    if(Number.isNaN(lng) || Number.isNaN(lat) || Number.isNaN(distanceInMeters)){
        throw {text: 'Invalid geographical parameters', code: 400};
    }

    return {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            $maxDistance: distanceInMeters
        }
    };
}

// Haversine formula
exports.calculateDistance = (lng1, lat1, lng2, lat2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat/2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng/2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
}