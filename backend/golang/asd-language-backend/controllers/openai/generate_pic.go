package openai

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

func GeneratePic(prompt string) string {

	url := openai_url + "/images/generations"
	method := "POST"

	str, _ := json.Marshal(prompt)

	payload := strings.NewReader(`{
		"model": "dall-e-3",
		"prompt": ` + string(str) + `,
		"n": 1,
		"size": "1024x1024"
	}`)

	client := &http.Client{}
	req, err := http.NewRequest(method, url, payload)
	// fmt.Println(payload)
	if err != nil {
		fmt.Println(err)
		return "0"
	}
	req.Header.Add("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+openai_key)

	res, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return "0"
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
		return "0"
	}
	// fmt.Println(string(body))

	// 创建一个Person类型的变量
	var tmp GenPicResponse

	// 将JSON字符串解析为Person结构体
	err = json.Unmarshal(body, &tmp)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
		return "0"
	}
	// fmt.Println()
	if len(tmp.Data) > 0 {
		url := tmp.Data[0].URL
		fmt.Println("URL:", url)
		return url
	} else {
		fmt.Println("No data found in JSON")
		return "0"
	}
}
