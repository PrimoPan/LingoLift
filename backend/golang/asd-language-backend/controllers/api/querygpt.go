package api

import (
	"asd/controllers/openai"
)

var MessageDict = make(map[string][]Message)

type GPTResponse struct {
	Answer string `json:"answer"`
}

func queryGPT(uid string, question string) string {
	// var answer string = ""
	// sendWsMessage(uid, "GPTStart")
	openai.CreateMessage(userThreadBase[uid], question)
	tmp := openai.CreateRun(userThreadBase[uid], AssistID, func(msgtype string, data string) {
		// 流式输出
		// if msgtype == "resp" {
		// 	sendWsMessage(uid, "GPTDelta:"+data)
		// }
	})
	// sendWsMessage(uid, "GPTEnd")
	addLog(uid, "A:\t"+tmp)
	return tmp
}
