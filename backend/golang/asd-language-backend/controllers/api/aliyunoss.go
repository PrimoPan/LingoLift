package api

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/aliyun/aliyun-oss-go-sdk/oss"
)

func handleError(err error) {
	fmt.Println("Error:", err)
	os.Exit(-1)
}
func aliyunoss(uid string, filepath string) string {
	// yourBucketName填写存储空间名称。
	bucketName := "tgzihg"
	projectName := "asd_language"
	// yourObjectName填写Object完整路径，完整路径不包含Bucket名称。

	sep := "/"
	filename := ""
	index := strings.LastIndex(filepath, sep)
	if index >= 0 {
		// 使用最后一个分隔符位置对字符串进行分割
		filename = filepath[index+len(sep):]
	}

	objectName := projectName + "/" + filename
	// yourLocalFileName填写本地文件的完整路径。
	localFileName := filepath

	// 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
	// provider, err := oss.NewEnvironmentVariableCredentialsProvider()
	// if err != nil {
	// 	fmt.Println("Error:", err)
	// 	os.Exit(-1)
	// }

	// 创建OSSClient实例。
	// yourEndpoint填写Bucket对应的Endpoint，以华东1（杭州）为例，填写为https://oss-cn-hangzhou.aliyuncs.com。其它Region请按实际情况填写。
	client, err := oss.New("https://oss-cn-shanghai.aliyuncs.com", "LTAI5tHkyfvFdkUufjYNJoJU", "WL0bwWxhfFw6Nq9qx965ttiuX42AuG")
	// client, err := oss.New("yourEndpoint", "", "", oss.SetCredentialsProvider(&provider))
	if err != nil {
		fmt.Println("Error:", err)
		os.Exit(-1)
	}

	// 获取存储空间。
	bucket, err := client.Bucket(bucketName)
	if err != nil {
		handleError(err)
	}
	// 上传文件。
	err = bucket.PutObjectFromFile(objectName, localFileName)
	if err != nil {
		handleError(err)
	}
	// 判断文件是否存在。
	for {
		isExist, err := bucket.IsObjectExist(objectName)
		if err != nil {
			fmt.Println("Error:", err)
			os.Exit(-1)
		}
		if isExist {
			addLog(uid, "pic file saved "+"https://tgzihg.oss-cn-shanghai.aliyuncs.com/"+objectName)
			break
		}
		time.Sleep(time.Second)
	}
	return "https://tgzihg.oss-cn-shanghai.aliyuncs.com/" + objectName
}
