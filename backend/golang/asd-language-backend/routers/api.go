package routers

import (
	"asd/controllers/api"

	"github.com/gin-gonic/gin"
)

func ApiRtInit(r *gin.Engine) {
	apirouters := r.Group("/i")
	{
		// 注册用户、查询用户
		apirouters.POST("/adduser", api.APIController{}.AddUser)
		apirouters.POST("/getusers", api.APIController{}.GetAllData)

		// GPT对话
		// apirouters.POST("/gptinit", api.APIController{}.GPTInit)
		apirouters.POST("/gpt", api.APIController{}.GPTQuery)

		// 接收图片，保存图片到服务器本地，上传图片到阿里云，随后发出图片
		// apirouters.POST("/pic", api.APIController{}.SavePic)
		// apirouters.POST("/pic2", api.APIController{}.SavePic2)
		// 接收文字，生成图片，保存图片到服务器本地，随后上传图片到阿里云，随后发出图片
		apirouters.POST("/pic", api.APIController{}.GenPic)
		apirouters.POST("/pic_hylite", api.APIController{}.GenPicByHunYuanLite)
		apirouters.POST("/pic_hy", api.APIController{}.GenPicByHunYuan)
	}
}
