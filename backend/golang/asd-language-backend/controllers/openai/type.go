package openai

type CreateThreadResponse struct {
	CreatedAt     int64                  `json:"created_at"`
	ID            string                 `json:"id"`
	Metadata      map[string]interface{} `json:"metadata"`
	Object        string                 `json:"object"`
	ToolResources map[string]interface{} `json:"tool_resources"`
}

type GenPicResponse struct {
	Created int64 `json:"created"`
	Data    []struct {
		RevisedPrompt string `json:"revised_prompt"`
		URL           string `json:"url"`
	} `json:"data"`
}

type IDResponse struct {
	ID string `json:"id"`
}

type StatusResponse struct {
	Status string `json:"status"`
}

// REGION START
// 用于接收assistant stream api返回的数据
type DeltaContent struct {
	Text struct {
		Value string `json:"value"`
	} `json:"text"`
}

type Delta struct {
	Content []DeltaContent `json:"content"`
}

type Data struct {
	Object string `json:"object"`
	Delta  *Delta `json:"delta,omitempty"`
}

// REGION END
