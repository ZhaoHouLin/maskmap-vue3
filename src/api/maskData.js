import axios from 'axios'
const maskData = axios.create({
  baseURL: 'https://raw.githubusercontent.com/kiang/pharmacies/master/json/'
})
export const getMaskData = () => maskData.get('/points.json')