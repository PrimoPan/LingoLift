package openai

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// 输入：用户id
// 返回：thread id
func CreateThread() string {

	url := openai_url + "/threads"
	method := "POST"

	// tr := &http.Transport{
	// 	TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	// }
	// client := &http.Client{Transport: tr}
	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)

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

	// 创建一个Person类型的变量
	var tmp CreateThreadResponse

	// 将JSON字符串解析为Person结构体
	err = json.Unmarshal(body, &tmp)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return "error"
	}

	return tmp.ID
}
