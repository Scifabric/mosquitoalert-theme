export function getRandomResults(store){
    var offset = Math.floor(Math.random() * 100) + 1  
    var url = store.state.endpoint + '/result?&fulltextsearch=1&all=1&limit=100&offset=' + offset
    return axios.get(url)
}
