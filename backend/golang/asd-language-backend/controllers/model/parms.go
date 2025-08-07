package models

type SettingParms struct {
	DbName  string
	SQLUser string
	SQLPwd  string
	SQLAdd  string
}

// For localhost
var SysParms SettingParms = SettingParms{
	DbName:  "asd-language",
	SQLUser: "asd-language",
	SQLPwd:  "asd-language",
	SQLAdd:  "47.242.78.104:3306",
}
