package api

import (
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"time"
)

func addLog(uid string, data string) {
	tmp := "LOG\t" + getCurrentTime() + "\t" + uid + "\t" + data
	fmt.Println(tmp)
}

func getCurrentTime() string {
	currentTime := time.Now()
	fileName := currentTime.Format("2006-01-02_15-04-05")
	return fileName
}

// downloadFile 下载指定URL的内容并保存到指定文件中
func downloadFile(filepath string, url string) error {
	// 创建文件
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// 获取数据
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// 检查HTTP响应状态码
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	// 将数据写入文件
	_, err = io.Copy(out, resp.Body)
	return err
}

// 生成指定长度的随机字母和数字组合
func generateRandomString(length int) string {
	charset := "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}
