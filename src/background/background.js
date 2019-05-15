import {getData} from '../utils'
import axios from 'axios'
var docs = []
chrome.omnibox.onInputStarted.addListener(function() {
    var token = getData('token') || 'fyuibqeduSNynPLs1InpYV7bu8t8FbHS3Z3SZRVw'
    var repo = getData('currentBook')
    var api = axios.create({
        baseURL: 'https://www.yuque.com/api/v2/',
        timeout: 1500,
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token
        }
    })
    if(docs.length === 0) {
        api.get(`/repos/${repo.id}/docs`).then((res) => {
            docs =  res.data.data
            // console.log(docs)
        })
    }
})
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    var res = []
    var repo = getData('currentBook')
    var userinfo = getData('userinfo')
    for(let i=0;i<docs.length;i++) {
        if(docs[i].title.indexOf(text) > -1) {
            res.push({
                description:docs[i].title,
                content:`https://www.yuque.com/${userinfo.login}/${repo.slug}/${docs[i].slug}`
            })
        }
    }
    suggest(res)
  }
)
// 重置 默认推荐
function resetDefaultSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
    description: '搜索语雀仓库'
  });
}

resetDefaultSuggestion();

chrome.omnibox.onInputEntered.addListener((text,disposition) => {
    window.open(text)
})