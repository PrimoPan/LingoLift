package api

import (
	models "asd/controllers/model"
	"asd/controllers/openai"
	"encoding/json"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tidwall/gjson"
)

type APIController struct {
}

func (con APIController) AddUser(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	var input InputData_AddUser
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(200, gin.H{
			"code": -1,
			"msg":  "输入信息解析失败-" + err.Error(),
		})
		return
	}
	fmt.Println(input)
	uid := generateRandomString(4)
	tmp := models.UserInfo{
		Uid:         uid,
		Name:        input.Name,
		Age:         input.Age,
		Gender:      input.Gender,
		Period:      input.Period,
		Qhwshiwu:    input.Qhw.Shiwu,
		Qhwfood:     input.Qhw.Food,
		Qhwactivity: input.Qhw.Activity,
		Qhwsense:    input.Qhw.Sense,
		Qhwsocial:   input.Qhw.Social,
		Gradevoc:    input.Grade.Voc,
		Gradedia:    input.Grade.Dia,
		Gradename:   input.Grade.Name,
		Gradestru:   input.Grade.Stru,
		Photo:       input.Photo,
	}
	fmt.Println(tmp)

	models.AddAUserID(tmp)
	fmt.Println("User Added:" + tmp.Name)

	c.JSON(200, gin.H{
		"code": 0,
		"uid":  uid,
	})
}

func (con APIController) GetAllData(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	// 查询用户信息
	userdata := models.GetUserData()
	c.JSON(200, gin.H{
		"code": 0,
		"data": userdata,
	})
}

func (con APIController) GPTQuery(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	var input InputData_GPT
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(200, gin.H{
			"code": -1,
			"msg":  err.Error(),
		})
		return
	}
	var uid = input.Uid

	if input.Newtalk == 0 {
		addLog(uid, "Continue Thread:\t"+userThreadBase[uid])
	} else {
		userThreadBase[uid] = openai.CreateThread()
		addLog(uid, "New Thread:\t"+userThreadBase[uid])
	}

	var question = input.Qus
	addLog(uid, "Q:\t"+question)
	ans := queryGPT(uid, question)

	c.JSON(200, gin.H{
		"code": 0,
		"data": ans,
	})
}

// func (con APIController) NewGPTThread(c *gin.Context) {
// 	defer func(c *gin.Context) {
// 		if r := recover(); r != nil {
// 			c.JSON(200, gin.H{
// 				"code": -1,
// 			})
// 		}
// 	}(c)

// 	var input InputData_newGPT
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(200, gin.H{
// 			"code": -1,
// 			"msg":  err.Error(),
// 		})
// 		return
// 	}
// 	var uid = input.Uid
// 	userThreadBase[uid] = openai.CreateThread()
// 	addLog(uid, "New Thread:\t"+userThreadBase[uid])
// 	c.JSON(200, gin.H{
// 		"code": 0,
// 	})
// }

func (con APIController) GenPic(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	var input InputData_DALLE
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(200, gin.H{
			"code": -1,
			"msg":  err.Error(),
		})
		return
	}
	var uid = input.Uid
	var picPrompt = input.Picreq
	addLog(uid, "Pic generate:"+picPrompt)
	genPicUrl := openai.GeneratePic(picPrompt)
	aliyunoss_url := aliyunoss(uid, DownloadFile(genPicUrl))
	c.JSON(200, gin.H{
		"code":   0,
		"imgurl": aliyunoss_url,
	})
}

func (con APIController) GenPicByHunYuanLite(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	var input InputData_HUNYUANLite
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(200, gin.H{
			"code": -1,
			"msg":  err.Error(),
		})
		return
	}
	var uid = input.Uid
	var picPrompt = input.Picreq
	var format = input.Format
	addLog(uid, "HunyuanLITE Pic generate:"+picPrompt)
	genPicUrl := HUNYUAN_GenPicLite(uid, picPrompt, format)

	picurl := gjson.Get(genPicUrl, "Response.ResultImage").String()
	aliyunoss_url := aliyunoss(uid, DownloadFile(picurl))

	c.JSON(200, gin.H{
		"code":   0,
		"imgurl": aliyunoss_url,
	})
}

func (con APIController) GenPicByHunYuan(c *gin.Context) {
	defer func(c *gin.Context) {
		if r := recover(); r != nil {
			c.JSON(200, gin.H{
				"code": -1,
			})
		}
	}(c)

	// 1. 抽取参数
	var input InputData_HUNYUAN
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(200, gin.H{
			"code": -1,
			"msg":  err.Error(),
		})
		return
	}
	var uid = input.Uid
	var picPrompt = input.Picreq

	addLog(uid, "Hunyuan Pic generate:"+picPrompt)

	// 2. 提交任务

	subGenPic := HUNYUAN_Submit_Photo(uid, picPrompt)
	var respdata map[string]interface{}
	err := json.Unmarshal([]byte(subGenPic), &respdata)
	if err != nil {
		// 处理错误
		fmt.Println("convert failed: " + subGenPic)
	}

	jobID := gjson.Get(subGenPic, "Response.JobId").String()
	fmt.Println("HUNYUAN Pic JOB ID " + jobID)

	// 3. 轮询，得到url后返回键

	for {
		query_result := HUNYUAN_Query_Photo(jobID)
		fmt.Println(query_result)

		jobStatus := gjson.Get(query_result, "Response.JobStatusCode").String()
		imgUrl := gjson.Get(query_result, "Response.ResultImage|0").String()
		if jobStatus == "5" {
			fmt.Println("处理完成")
			fmt.Println(query_result)

			var respdata map[string]interface{}
			err := json.Unmarshal([]byte(query_result), &respdata)
			if err != nil {
				// 处理错误
				fmt.Println("convert failed: " + query_result)
				c.JSON(200, "convert failed: "+query_result)
			}
			aliyunoss_url := aliyunoss(uid, DownloadFile(imgUrl))

			c.JSON(200, gin.H{
				"code":   0,
				"imgurl": aliyunoss_url,
			})
			break
		} else if jobStatus == "1" || jobStatus == "2" {
			time.Sleep(2 * time.Second)
			continue
		} else {
			break
		}
	}
}
