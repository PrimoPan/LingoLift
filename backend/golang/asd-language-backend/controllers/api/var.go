package api

// 添加用户的输入参数
type InputData_AddUser struct {
	Name   string `json:"name"`
	Age    int    `json:"age"`
	Gender int    `json:"gender"`
	Period int    `json:"period"`
	Qhw    QHW    `json:"qhw"`
	Grade  Grade  `json:"grade"`
	Photo  string `json:"photo"`
}

type QHW struct {
	Shiwu    string `json:"shiwu"`
	Food     string `json:"food"`
	Activity string `json:"activity"`
	Sense    string `json:"sense"`
	Social   string `json:"social"`
}

type Grade struct {
	Voc  int `json:"voc"`
	Name int `json:"name"`
	Stru int `json:"stru"`
	Dia  int `json:"dia"`
}

// 文生文GPT
type InputData_GPT struct {
	Uid     string `json:"uid"`
	Qus     string `json:"qus"`
	Newtalk int    `json:"newtalk"`
}

// 文生图
type InputData_DALLE struct {
	Uid    string `json:"uid"`
	Picreq string `json:"picreq"`
}

// 文生图_混元Lite
type InputData_HUNYUANLite struct {
	Uid    string `json:"uid"`
	Picreq string `json:"picreq"`
	Format string `json:"format"`
}

// 文生图_混元
type InputData_HUNYUAN struct {
	Uid    string `json:"uid"`
	Picreq string `json:"picreq"`
}

// 输入信息参数
// type InputFormData struct {
// 	Uid      string `json:"uid"`
// 	Realname string `json:"name"`
// 	Age      string `json:"age"`
// 	Gender   string `json:"gender"`
// 	City     string `json:"city"`
// 	Work     string `json:"work"`
// }

// type InputStoryData struct {
// 	Uid          string `json:"uid"`
// 	StoryTopic   string `json:"topic"`
// 	StoryContent string `json:"content"`
// 	StoryPics    string `json:"pics"`
// }

// 每个用户的当前对话线程
var userThreadBase = make(map[string]string)

var AssistID = "asst_IYrrI9Do4ueFmpZmlagWvU5m" // gpt-4o

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// var picGenPromptPre = "生成图片，描述下列场景："
