package api

import (
	"fmt"

	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/errors"
	"github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common/profile"
	hunyuan "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/hunyuan/v20230901"
)

var hunyuan_1 = "AKIDQfgS1PAh04tAIBTXNyymMiqmUyEG4ez5"
var hunyuan_2 = "vc4HFyTjRcbMtDJAnGTTFm39IG4vfCXd"

func HUNYUAN_GenPicLite(uid string, prompt string, format string) string {
	// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
	// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
	// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
	credential := common.NewCredential(
		hunyuan_1,
		hunyuan_2,
	)

	// 实例化一个client选项，可选的，没有特殊需求可以跳过
	cpf := profile.NewClientProfile()
	cpf.HttpProfile.Endpoint = "hunyuan.tencentcloudapi.com"
	// 实例化要请求产品的client对象,clientProfile是可选的
	client, _ := hunyuan.NewClient(credential, "ap-guangzhou", cpf)

	// 实例化一个请求对象,每个接口都会对应一个request对象
	request := hunyuan.NewTextToImageLiteRequest()

	request.Prompt = common.StringPtr(prompt)
	request.LogoAdd = common.Int64Ptr(0)
	request.RspImgType = common.StringPtr(format)

	// 返回的resp是一个TextToImageLiteResponse的实例，与请求对象对应
	response, err := client.TextToImageLite(request)
	if _, ok := err.(*errors.TencentCloudSDKError); ok {
		fmt.Printf("An API error has returned: %s", err)
		return "error"
	}
	if err != nil {
		panic(err)
	}
	// 输出json格式的字符串回包
	// fmt.Printf("%s", response.ToJsonString())
	return response.ToJsonString()
}

func HUNYUAN_Submit_Photo(uid string, prompt string) string {
	// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
	// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
	// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
	credential := common.NewCredential(
		hunyuan_1,
		hunyuan_2,
	)
	// 实例化一个client选项，可选的，没有特殊需求可以跳过
	cpf := profile.NewClientProfile()
	cpf.HttpProfile.Endpoint = "hunyuan.tencentcloudapi.com"
	// 实例化要请求产品的client对象,clientProfile是可选的
	client, _ := hunyuan.NewClient(credential, "ap-guangzhou", cpf)

	// 实例化一个请求对象,每个接口都会对应一个request对象
	request := hunyuan.NewSubmitHunyuanImageJobRequest()

	request.Prompt = common.StringPtr(prompt)
	request.LogoAdd = common.Int64Ptr(0)

	// 返回的resp是一个SubmitHunyuanImageJobResponse的实例，与请求对象对应
	response, err := client.SubmitHunyuanImageJob(request)
	if _, ok := err.(*errors.TencentCloudSDKError); ok {
		fmt.Printf("An API error has returned: %s", err)
		return "0"
	}
	if err != nil {
		panic(err)
	}
	return response.ToJsonString()
}

func HUNYUAN_Query_Photo(jobid string) string {
	// 实例化一个认证对象，入参需要传入腾讯云账户 SecretId 和 SecretKey，此处还需注意密钥对的保密
	// 代码泄露可能会导致 SecretId 和 SecretKey 泄露，并威胁账号下所有资源的安全性。以下代码示例仅供参考，建议采用更安全的方式来使用密钥，请参见：https://cloud.tencent.com/document/product/1278/85305
	// 密钥可前往官网控制台 https://console.cloud.tencent.com/cam/capi 进行获取
	credential := common.NewCredential(
		hunyuan_1,
		hunyuan_2,
	)
	// 实例化一个client选项，可选的，没有特殊需求可以跳过
	cpf := profile.NewClientProfile()
	cpf.HttpProfile.Endpoint = "hunyuan.tencentcloudapi.com"
	// 实例化要请求产品的client对象,clientProfile是可选的
	client, _ := hunyuan.NewClient(credential, "ap-guangzhou", cpf)

	// 实例化一个请求对象,每个接口都会对应一个request对象
	request := hunyuan.NewQueryHunyuanImageJobRequest()

	request.JobId = common.StringPtr(jobid)

	// 返回的resp是一个QueryHunyuanImageJobResponse的实例，与请求对象对应
	response, err := client.QueryHunyuanImageJob(request)
	if _, ok := err.(*errors.TencentCloudSDKError); ok {
		fmt.Printf("An API error has returned: %s", err)
		return "0"
	}
	if err != nil {
		panic(err)
	}
	// 输出json格式的字符串回包
	// fmt.Printf("%s", response.ToJsonString())

	return response.ToJsonString()
}
