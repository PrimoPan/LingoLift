# 后端

## 项目启动

```
go run main.go
```

## 项目部署

本地部署

```
go build
```

mac平台交叉编译到 Linux 通用 64 位系统(Centos、Ubuntu等)

```
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
```

windows平台交叉编译到linux

    // Powershell环境
    $env:CGO_ENABLED="0"
    $env:GOOS="linux"
    $env:GOARCH="amd64"
    go build

## 接口说明
