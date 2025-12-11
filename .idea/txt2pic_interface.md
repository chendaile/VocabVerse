# 文生图 (txt2pic) API 接口文档

本文档为前端开发人员提供调用文生图 (txt2pic) 功能的后端 API 指南.

整体流程是一个异步任务:
1.  通过 `POST` 请求提交一个图片生成任务, 并获得一个唯一的 `taskId`.
2.  通过 `GET` 请求, 使用 `taskId` 来轮询任务状态, 直到任务完成或失败, 以获取最终结果.

---

## 1. 创建图片生成任务

此接口用于提交一个文本提示 (prompt) 来创建异步的图片生成任务.

- **方法:** `POST`
- **路径:** `/txt2pic/generate-image`
- **Content-Type:** `application/json`

### 请求体 (Request Body)

| 字段 | 类型 | 是否必须 | 描述 |
| :--- | :--- | :--- | :--- |
| `prompt` | `string` | 是 | 用于生成图片的文本描述. |
| `num_images` | `number`| 否 | 需要生成的图片数量, 默认为 1. |

**请求体示例:**
```json
{
  "prompt": "一只戴着宇航员头盔的猫, 数字艺术",
  "num_images": 1
}
```

### 响应 (Response)

服务器已接受任务, 返回任务ID和初始状态.

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `taskId` | `string` | 唯一任务ID, 用于后续状态查询. |
| `status` | `string` | 任务的初始状态, 通常为 `PENDING`. |
| `message`| `string` | 提示信息. |

**成功响应示例:**
```json
{
  "taskId": "clwbigp1s0000sgpfylg17z4p",
  "status": "PENDING",
  "message": "Image generation task has been accepted. Please poll for status."
}
```

**错误响应 (400 Bad Request):**
如果 `prompt` 字段为空.

**错误响应示例:**
```json
{
  "statusCode": 400,
  "message": "prompt 不能为空",
  "error": "Bad Request"
}
```

### cURL 调用示例

**请求:**
```bash
curl -X POST -H 'Content-Type: application/json' \
-d '{"prompt":"draw a dog"}' \
https://csu-mcp.xyz/txt2pic/generate-image
```

**响应:**
```json
{
  "taskId": "cmj1fpkl4000001ojt6uispe9",
  "status": "PENDING",
  "message": "Image generation task has been accepted. Please poll for status."
}
```

---

## 2. 查询图片生成状态

此接口用于根据任务ID轮询, 以获取图片生成的状态和最终结果.

- **方法:** `GET`
- **路径:** `/txt2pic/images/status/:taskId`

### 路径参数 (Path Parameters)

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `taskId` | `string` | 从创建任务接口中获取的任务ID. |

### 响应 (Response)

返回任务的当前状态.

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `taskId` | `string` | 任务ID. |
| `status` | `string` | 任务的当前状态. (详情见下文`status`字段说明) |
| `result` | `object` \| `null` | 当任务状态为 `COMPLETED` 时, 此字段包含生成结果, 例如图片URL. |
| `error` | `string` \| `null` | 当任务状态为 `FAILED` 时, 此字段包含错误信息. |

#### `status` 字段说明

`status` 字段是表示任务当前进度的枚举值, 包括以下几种可能:

- `PENDING`: 任务已提交, 等待处理.
- `PROCESSING`: 任务正在处理中.
- `COMPLETED`: 任务成功完成.
- `FAILED`: 任务处理失败.

#### 响应示例

**响应示例 (处理中):**
```json
{
  "taskId": "clwbigp1s0000sgpfylg17z4p",
  "status": "PENDING",
  "result": null,
  "error": null
}
```

**响应示例 (已完成):**
```json
{
  "taskId": "clwbigp1s0000sgpfylg17z4p",
  "status": "COMPLETED",
  "result": {
    "url": "http://vocabverse.oss-cn-shanghai.aliyuncs.com/images/cmj1fpkl4000001ojt6uispe9.png"
  },
  "error": null
}
```

**错误响应 (404 Not Found):**
如果提供的 `taskId` 无效或不存在.

```json
{
  "statusCode": 404,
  "message": "Task not found",
  "error": "Not Found"
}
```

### cURL 调用示例

**请求:**
```bash
curl -X GET https://csu-mcp.xyz/txt2pic/images/status/cmj1fpkl4000001ojt6uispe9
```

**响应 (已完成):**
```json
{
  "taskId": "clwbigp1s0000sgpfylg17z4p",
  "status": "COMPLETED",
  "result": {
    "url": "http://vocabverse.oss-cn-shanghai.aliyuncs.com/images/cmj1fpkl4000001ojt6uispe9.png"
  },
  "error": null
}
```