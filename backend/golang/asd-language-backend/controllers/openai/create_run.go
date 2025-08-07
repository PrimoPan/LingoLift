package openai

import (
	"bufio"
	"fmt"
	"net/http"
	"strings"
)

// 需要 1.处理类型；2.处理内容
type RespFunc func(string, string)

// 根据thread_id 和 assistant_id创建run，并指定一个回调函数，用于处理过程数据，可以流式传输
// thread_id: 线程id
// assistant_id：助手id
// 返回run id
func CreateRun(thread_id string, assistant_id string, handle_resp RespFunc) string {

	url := openai_url + "/threads/" + thread_id + "/runs"
	method := "POST"

	payload := strings.NewReader(`{
		"assistant_id": "` + assistant_id + `",
		"stream": true
	}`)

	req, err := http.NewRequest(method, url, payload)

	if err != nil {
		fmt.Println(err)
		return err.Error()
	}
	req.Header.Add("OpenAI-Beta", "assistants=v2")
	req.Header.Add("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+openai_key)

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return err.Error()
	}
	defer res.Body.Close()
	handle_resp("start", "")
	// 创建一个 bufio.Scanner 来读取响应体
	scanner := bufio.NewScanner(res.Body)
	text2Sum := ""
	for scanner.Scan() {
		line := scanner.Text()
		// fmt.Println(line)
		if getChunkType(line) == "data" {
			// 判断data的数据类型
			// fmt.Println("Received:", line)
			_, data := getDataType(line)
			// fmt.Println("Type\t" + dataType)
			if data != "" {
				// fmt.Println("Cont\t" + data)
				handle_resp("resp", data)
				// fmt.Print(data)
				text2Sum += data
			}
		}
		// 在这里处理每一行的数据
	}
	handle_resp("end", "")
	// fmt.Println()
	// fmt.Println("Finnal Answer")
	// fmt.Println(text2Sum)
	return text2Sum
}
