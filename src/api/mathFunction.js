const LatLonDistance = (λA, ΦA, λB, ΦB) => {   //計算經緯度距離
  if ((λA == λB) && (ΦA == ΦB)) {
    return 0;
  }
  else {
    let radlat1 = Math.PI * λA / 180;
    let radlat2 = Math.PI * λB / 180;
    let theta = ΦA - ΦB;
    let radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344
    // if (unit=="N") { dist = dist * 0.8684 }
    // console.log(λA,ΦA,'&',λB,ΦB ,'result',dist)
    dist = dist.toFixed(2)
    // return dist < 1 ? dist * 1000 + '公尺' : dist + '公里'
    return dist
  }
}

export const getLatLonDistance = LatLonDistance