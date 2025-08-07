package api

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"
)

func DownloadFile(url string) string {
	imgUrl := url
	fmt.Println("Download image:" + imgUrl)
	now := time.Now()
	millis := now.Unix()

	// Get the data
	resp, err := http.Get(imgUrl)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var savePath = "./pics/" + strconv.FormatInt(millis, 10) + ".png"
	// 创建一个文件用于保存
	out, err := os.Create(savePath)
	if err != nil {
		panic(err)
	}
	defer out.Close()

	// 然后将响应流和文件流对接起来
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		panic(err)
	}
	fmt.Println("Download image DONE")

	return savePath
}
