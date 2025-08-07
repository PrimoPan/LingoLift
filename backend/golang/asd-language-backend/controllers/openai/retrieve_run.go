package openai

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// 得到run的当前状态：in_progress/complete
func RetrieveRun(thread_id string, run_id string) string {

	url := openai_url + "/threads/" + thread_id + "/runs/" + run_id
	method := "GET"

	client := &http.Client{}
	req, err := http.NewRequest(method, url, nil)

	if err != nil {
		fmt.Println(err)
		return err.Error()
	}
	req.Header.Add("OpenAI-Beta", "assistants=v2")
	req.Header.Add("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
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
	// fmt.Println(string(body))

	// 创建一个Person类型的变量
	var tmp StatusResponse

	// 将JSON字符串解析为Person结构体
	err = json.Unmarshal(body, &tmp)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return "error"
	}
	return tmp.Status
}
