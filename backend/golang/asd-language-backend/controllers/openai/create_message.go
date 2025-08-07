package openai

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

// thread_id: 线程id
// message：提问问题内容
// 返回message id
func CreateMessage(thread_id string, message string) string {

	url := openai_url + "/threads/" + thread_id + "/messages"
	method := "POST"

	payload := strings.NewReader(`{
      "role": "user",
      "content": "` + message + `"
	}`)
	// tr := &http.Transport{
	// 	TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	// }
	// client := &http.Client{Transport: tr}
	client := &http.Client{}

	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return err.Error()
	}
	req.Header.Add("OpenAI-Beta", "assistants=v2")
	req.Header.Add("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+openai_key)

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return err.Error()
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return err.Error()
	}
	// 创建一个响应类型的变量
	var tmp IDResponse

	// 将JSON字符串解析为Person结构体
	err = json.Unmarshal(body, &tmp)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return "error"
	}

	return tmp.ID
}
