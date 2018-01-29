import Axios from '@/assets/js/AxiosPlugin'

export const getPersonList = (data) => {
  console.log(data)
  return Axios.post('/egc-mdmmgmtapp/user/getUsersByConditions', data
  ).then(res => res.data)
}
