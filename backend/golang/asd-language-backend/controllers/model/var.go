// 存储数据库操作的相关model
package models

type UserInfo struct {
	Uid         string `json:"uid" gorm:"primaryKey"`
	Name        string `json:"name"`
	Age         int    `json:"age"`
	Gender      int    `json:"gender"`
	Period      int    `json:"period"`
	Qhwshiwu    string `json:"qhw-shiwu"`
	Qhwfood     string `json:"qhw-food"`
	Qhwactivity string `json:"qhw-activity"`
	Qhwsense    string `json:"qhw-sense"`
	Qhwsocial   string `json:"qhw-social"`
	Gradevoc    int    `json:"grade-voc"`
	Gradename   int    `json:"grade-name"`
	Gradestru   int    `json:"grade-stru"`
	Gradedia    int    `json:"grade-dia"`
	Photo       string `json:"photo"`
}

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
