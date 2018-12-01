# Quizzes backend API

## Quiz and Question APIs
List APIs:

- [`api/quiz_question/<quiz_id>/`](#`api/quiz_question/<quiz_id>/`)
- [`api/full_quiz/<quiz_id>/`](#`api/full_quiz/<quiz_id>/`)
- [`api/create_quiz/`](#`api/create_quiz/`)
- [`api/recent_quiz/`](#`api/recent_quiz/`)
- [`api/submit_quiz/`](#`api/submit_quiz/`)
- [`api/posted_quiz/`](#`api/posted_quiz/`)
- [`api/quiz_result/<quiz_id>/`](#`api/quiz_result/<quiz_id>/`)
- [`api/quiz_category/<cate>/`](#`api/quiz_category/<cate>/`)

### `api/quiz_question/<quiz_id>/`
**Method:** `GET`

**Descriptions:** Response a quiz with its questions, solutions is not included

**Parameters:** None

Example:
```
Link: http://127.0.0.1:8000/api/quiz_question/3/

Response: 200 OK
{
    "id": 3,
    "title": "Third quiz",
    "brief": "This is the third quiz",
    "category": "ma",
    "shuffle": false,
    "questions": [
        {
            "type": "si",
            "index": 0,
            "content": "What is django based on?",
            "options": ["java", "python", "c++", "ruby"]
        },
        {
            "index": 1,
            "type": "ma",
            "content": "Matching this statements",
            "options": ["3", "2", "4"],
            "matchings": ["1+1", "1+2", "1+3"]
        }
    ]
}
```

### `api/quiz_result/<quiz_id>/`
**Method:** `GET`

**Descriptions:** Response a submission of a quiz that user has done before.

**Parameters:** None

Example:
```
Link: http://127.0.0.1:8000/api/quiz_result/1/

Response: 200 OK
{
    "id": 1,
    "quiz": 1,
    "mark": 1,
    "answers": [
        {
            "solution": [
                "Ha Noi"
            ],
            "index": 0,
            "correct": true,
            "answer": [
                "Ha Noi"
            ]
        },
        {
            "solution": [
                "ulis",
                "uet",
                "ueb"
            ],
            "index": 1,
            "correct": true,
            "answer": [
                "uet",
                "ulis",
                "ueb"
            ]
        }
    ]
}

If not exist: 404 Not Found
```

### `api/full_quiz/<quiz_id>/`
**Method:** `GET`

**Descriptions:** Response a quiz with its questions, solutions is included

**Parameters:** None

Example:
```
Link: http://127.0.0.1:8000/api/full_quiz/3/

Response: 200 OK
{
    "id": 3,
    "title": "Third quiz",
    "brief": "This is the third quiz",
    "category": "ma",
    "shuffle": false,
    "questions": [
        {
            "type": "si",
            "index": 0,
            "content": "What is django based on?",
            "options": ["java", "python", "c++", "ruby"],
            "answer": ["python"]
        },
        {
            "index": 1,
            "answer": ["2", "3", "4"],
            "type": "ma",
            "content": "Matching this statements",
            "options": ["3", "2", "4"],
            "matchings": ["1+1", "1+2", "1+3"]
        }
    ]
}
```

**Method:** `PUT`

**Descriptions:** Use for update a quiz and its questions

**Parameters:**
- `id`: int
- `title`: string
- `brief`: string
- `category`: string, options: ('ma', 'cs')
- `shuffle`: boolean
- `questions`: array, an array of questions with parameters:
    - `type`: string, options: ('si', 'mu', 'ma', 'fi')
    - `index`: int, index of question in quiz
    - `content`: string
    - `options`: array, available options of question
    - `answer`: array, solutions of question
    - `matchings` (optional): array, an array of statements to match

Example:
```
Link: http://127.0.0.1:8000/api/full_quiz/4/

data:
{
    "title": "quiz 4",
    "brief": "This is 4th quiz",
    "category": "ma",
    "shuffle": false,
    "questions": [
        {
            "content": "Where are you from?",
            "options": ["Ha Noi", "Ho Chi Minh", "New York"],
            "type": "si",
            "answer": ["Ha Noi"],
            "index": 0
        },
        {
            "content": "Hello, how are you?",
            "options": ["I'm fine", "Fuck you", "Thank you", "Today is the worst day ever"],
            "type": "mu",
            "answer": ["Thank you", "I'm fine"],
            "index": 1
        }
    ]
}

Response: 200 OK
...

```

**Method:** `DELETE`

**Descriptions:** Use for update a quiz and its questions

**Parameters:** None

Example:
```
Link: http://127.0.0.1:8000/api/full_quiz/4/

Response: 204 No Content
```
### `api/create_quiz/`
**Method:** `POST`

**Descriptions:** Use for create a new quiz and its questions

**Parameters:**
- `id`: int
- `title`: string
- `brief`: string
- `category`: string, options: ('ma', 'cs')
- `shuffle`: boolean
- `questions`: array, an array of questions with parameters:
    - `type`: string, options: ('si', 'mu', 'ma', 'fi')
    - `index`: int, index of question in quiz
    - `content`: string
    - `options`: array, available options of question
    - `answer`: array, solutions of question
    - `matchings` (optional): array, an array of statements to match

Example:
```
Link: http://127.0.0.1:8000/api/create_quiz/

data:
{
    "title": "quiz 4",
    "brief": "This is 4th quiz",
    "category": "ma",
    "shuffle": false,
    "questions": [
        {
            "content": "Where are you from?",
            "options": ["Ha Noi", "Ho Chi Minh", "New York"],
            "type": "si",
            "answer": ["Ha Noi"],
            "index": 0
        },
        {
            "content": "Hello, how are you?",
            "options": ["I'm fine", "Fuck you", "Thank you", "Today is the worst day ever"],
            "type": "mu",
            "answer": ["Thank you", "I'm fine"],
            "index": 1
        }
    ]
}

Response: 201 Created
...

```

### `api/recent_quiz/`
**Method:** `GET`

**Descriptions:** Get a list of most recent quiz

**Parameters:**
- `page`: page index, start from 1
- `page_size`: number of items to response per page

Example:
```
Link: http://127.0.0.1:8000/api/recent_quiz/?page_size=2&page=2

Response: 200 OK
{
    "count": 4,
    "next": null,
    "previous": "http://127.0.0.1:8000/api/recent_quiz/?page_size=2",
    "results": [
        {
            "id": 2,
            "title": "quiz 1",
            "brief": "This is first quiz",
            "rating": 0,
            "created_at": "2018-12-01T10:52:01.028313Z",
            "status": "p",
            "category": "ma",
            "author": "minh"
        },
        {
            "id": 1,
            "title": "quiz 1",
            "brief": "This is first quiz",
            "rating": 0,
            "created_at": "2018-12-01T09:49:56.069562Z",
            "status": "p",
            "category": "ma",
            "author": "minh"
        }
    ]
}
```

### `api/quiz_category/<cate>/`
**Method:** `GET`

**Descriptions:** Get a list of most recent in a category

**Parameters:**
- `page`: page index, start from 1
- `page_size`: number of items to response per page

Example:
```
Link: http://127.0.0.1:8000/api/quiz_category/ma/?page_size=2&page=2

Response: 200 OK
{
    "count": 4,
    "next": null,
    "previous": "http://127.0.0.1:8000/api/quiz_category/ma/?page_size=2",
    "results": [
        {
            "id": 2,
            "title": "quiz 1",
            "brief": "This is first quiz",
            "rating": 0,
            "created_at": "2018-12-01T10:52:01.028313Z",
            "status": "p",
            "category": "ma",
            "author": "minh"
        },
        {
            "id": 1,
            "title": "quiz 1",
            "brief": "This is first quiz",
            "rating": 0,
            "created_at": "2018-12-01T09:49:56.069562Z",
            "status": "p",
            "category": "ma",
            "author": "minh"
        }
    ]
}

```

### `api/posted_quiz/`
**Method:** `GET`

**Descriptions:** Response a list of quiz that is created by an user

**Parameters:** 
- `page`: page index, start from 1
- `page_size`: number of items to response per page

Example:
```
Link: http://127.0.0.1:8000/api/posted_quiz/?page_size=2&page=1

Response: 200 OK
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "title": "quiz 1",
            "brief": "This is first quiz",
            "rating": 0,
            "created_at": "2018-11-27T09:47:25.881746Z",
            "status": "p",
            "category": "ma",
            "author": "minh"
        }
    ]
}
```

### `api/submit_quiz/`
**Method:** `POST`

**Descriptions:** Use for submit an quiz done by an user

**Parameters:**
- `quiz_id`: int
- `answers`: array, an array of user's answers with parameters:
    - `index`: int, index of question in quiz
    - `answer`: user's answer for the question

**Response:**
- `id`: int, submission's id
- `quiz_id`: int
- `mark`: float, the result of the submission
- `answers`: array, an array of user's answers with parameters:
    - `index`: int, index of question in quiz
    - `correct`: boolean, indicate the user's answer is correct or not
    - `solution`: the solution of the question
    - `answer`: user's answer for the question

Example:
```
Link: http://127.0.0.1:8000/api/submit_quiz/

data:
{"quiz_id": 1, "answers": [{"index": 0, "answer": ["Ha Noi"]}, {"index": 1, "answer": ["uet"]}]}

Response: 201 Created
{
    "id": 11,
    "quiz": 1,
    "mark": 0.5,
    "answers": [
        {
            "index": 0,
            "correct": true,
            "solution": [
                "Ha Noi"
            ],
            "answer": [
                "Ha Noi"
            ]
        },
        {
            "index": 1,
            "correct": false,
            "solution": [
                "ulis",
                "uet",
                "ueb"
            ],
            "answer": [
                "uet"
            ]
        }
    ]
}

```