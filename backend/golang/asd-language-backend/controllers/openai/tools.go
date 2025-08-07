package openai

import (
	"encoding/json"
	"fmt"
	"strings"
)

var event_prefix = "event"
var data_prefix = "data"

// 得到响应消息片段类型：event or data
func getChunkType(chunk string) string {
	if strings.HasPrefix(chunk, event_prefix) {
		return "event"
	} else if strings.HasPrefix(chunk, data_prefix) {
		return "data"
	} else {
		return "nodefined"
	}
}

// 得到响应事件类型：将event字符串按"."字符串分开取最后一个
// func getEventType(eventText string) string {
// 	parts := strings.Split(eventText, ".")

// 	// 获取最后一个子字符串
// 	if len(parts) > 0 {
// 		lastPart := parts[len(parts)-1]
// 		return lastPart
// 	} else {
// 		return "none"
// 	}
// }

// 判断data的json类型
// status: 当前片段的类型
// text:如果是delta，value值
func getDataType(dataText string) (status string, text string) {
	if dataText == "data: [DONE]" {
		return
	}
	// 去掉最开始的`data:`字符串
	jsonStr := strings.TrimPrefix(dataText, "data: ")

	// 解析 JSON 数据
	var data Data
	err := json.Unmarshal([]byte(jsonStr), &data)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
	}

	// 打印 object
	// fmt.Println("Object:", data.Object)
	status = data.Object

	// 打印 delta 中的 value
	if data.Delta != nil && len(data.Delta.Content) > 0 {
		for _, content := range data.Delta.Content {
			text = content.Text.Value
			// fmt.Println("Value:", )
		}
	}
	return
}

// 判断字符串非空
// func isNotEmptyOrWhitespace(s string) bool {
// 	// 使用 strings.TrimSpace 去除前后空白字符
// 	// trimmedStr := strings.TrimSpace(s)
// 	// 检查去除空白字符后的字符串是否为空
// 	return s != ""
// }
