# Quizzes backend API

## Quiz and Question APIs
List APIs:

- [`api/quiz_question/<quiz_id>/`](#apiquiz_questionquiz_id)
- [`api/full_quiz/<quiz_id>/`](#apifull_quizquiz_id)
- [`api/create_quiz/`](#apicreate_quiz)
- [`api/recent_quiz/`](#apirecent_quiz)
- [`api/submit_quiz/`](#apisubmit_quiz)
- [`api/posted_quiz/`](#apiposted_quiz)
- [`api/quiz_result/<quiz_id>/`](#apiquiz_resultquiz_id)
- [`api/quiz_category/<cate>/`](#apiquiz_categorycate)
- [`api/answered_quiz/`](#apianswered_quiz)

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
    "rating": 1,
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

**Response:**
- `id`: int, submission's id
- `quiz`: int, quiz's id
- `mark`: float, the result of the submission
- `title`: string
- `brief`: string
- `category`: string, options: ('ma', 'cs')
- `shuffle`: boolean
- `rating`: int, quiz's difficulty, options: (1(easy), 2(medium), 3(hard))
- `author`: string, username of the quiz's author
- `answers`: array, an array of user's answers with parameters:
    - `type`: string, options: ('si', 'mu', 'ma', 'fi')
    - `index`: int, index of question in quiz
    - `content`: string
    - `options`: array, available options of question
    - `answer`: array, solutions of question
    - `matchings` (optional): array, an array of statements to match
    - `user_answer`: user's answer for the question
    - `correct`: boolean, indicate the user's answer is correct or not

Example:
```
Link: http://127.0.0.1:8000/api/quiz_result/1/

Response: 200 OK
{
    "id": 2,
    "quiz": 22,
    "mark": 0.12,
    "answers": [
        {
            "index": 0,
            "type": "mu",
            "content": "There are 60 marbles in a bowl. Their colors are red, blue, and yellow. 1/3 of the marbles are yellow, 1/4 of the marbles are blue. How many red marbles are there in the bowl?",
            "options": [
                "30",
                "25",
                "28",
                "32"
            ],
            "answer": [
                "25",
                "28"
            ],
            "user_answer": [
                "30"
            ],
            "correct": false
        },
        {
            "index": 1,
            "type": "mu",
            "content": "What is the next number in the following sequence **4 16 5 25 6 36 7 49 8 _______**",
            "options": [
                "56",
                "64",
                "36",
                "52"
            ],
            "answer": [
                "64"
            ],
            "user_answer": [
                "56"
            ],
            "correct": false
        },
        {
            "index": 2,
            "type": "mu",
            "content": "What is 26x8?",
            "options": [
                "158",
                "198",
                "168",
                "208"
            ],
            "answer": [
                "208"
            ],
            "user_answer": [
                "158"
            ],
            "correct": false
        },
        {
            "index": 3,
            "type": "mu",
            "content": "How many legs (total ) does 4 dogs, 2 elephants, 15 cats, and 26 people have? ![image](https://imgc.allpostersimages.com/img/print/posters/dualororua-cartoon-wild-animals-background_a-G-15346796-9664571.jpg)",
            "options": [
                "98",
                "110",
                "136",
                "142"
            ],
            "answer": [
                "136"
            ],
            "user_answer": [
                "98"
            ],
            "correct": false
        },
        {
            "index": 4,
            "type": "mu",
            "content": "John works 4 days per week. He drives 10 miles round trip per day. If gas is $2.50 per gallon and his car gets 20 miles to the gallon, how much would he have spent on gasoline in 2 weeks getting back and forth to work?",
            "options": [
                "$8.50",
                "$10.00",
                "$12.00",
                "$9.50"
            ],
            "answer": [
                "$10.00"
            ],
            "user_answer": [
                "$8.50"
            ],
            "correct": false
        }
    ],
    "title": "Logic And Math Quiz",
    "brief": "How does your brain cope with a healthy dose of lateral thinking?",
    "category": "ma",
    "shuffle": false,
    "author": "admin",
    "rating": 0
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
    "rating": 2,
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
- `rating`: int, quiz's difficulty, options: (1(easy), 2(medium), 3(hard))
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
    "rating": 3,
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
- `rating`: int, quiz's difficulty, options: (1(easy), 2(medium), 3(hard))
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
    "rating": 2,
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
            "rating": 1,
            "created_at": "2018-12-01T10:52:01.028313Z",
            "status": "p",
            "category": "ma",
            "author": "minh"
        },
        {
            "id": 1,
            "title": "quiz 1",
            "brief": "This is first quiz",
            "rating": 1,
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
            "rating": 1,
            "created_at": "2018-12-01T10:52:01.028313Z",
            "status": "p",
            "category": "ma",
            "author": "minh"
        },
        {
            "id": 1,
            "title": "quiz 1",
            "brief": "This is first quiz",
            "rating": 1,
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
            "rating": 1,
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
- `quiz`: int, quiz's id
- `mark`: float, the result of the submission
- `title`: string
- `brief`: string
- `category`: string, options: ('ma', 'cs')
- `shuffle`: boolean
- `rating`: int, quiz's difficulty, options: (1(easy), 2(medium), 3(hard))
- `author`: string, username of the quiz's author
- `next_quiz`: int, suggested quiz's id
- `answers`: array, an array of user's answers with parameters:
    - `type`: string, options: ('si', 'mu', 'ma', 'fi')
    - `index`: int, index of question in quiz
    - `content`: string
    - `options`: array, available options of question
    - `answer`: array, solutions of question
    - `matchings` (optional): array, an array of statements to match
    - `user_answer`: user's answer for the question
    - `correct`: boolean, indicate the user's answer is correct or not

Example:
```
Link: http://127.0.0.1:8000/api/submit_quiz/

data:
{"quiz_id": 1, "answers": [{"index": 0, "answer": ["Ha Noi"]}, {"index": 1, "answer": ["uet"]}]}

Response: 201 Created

```

### `api/answered_quiz/`
**Method:** `GET`

**Descriptions:** Get a list of quizzes done by user

**Parameters:**
- `username`: string, if not specified, server will response the current user's answered quiz

Example:
```
Link: http://127.0.0.1:8000/api/answered_quiz/?username=admin

Response: 200 OK
[
    {
        "id": 22,
        "title": "Logic And Math Quiz",
        "brief": "How does your brain cope with a healthy dose of lateral thinking?",
        "rating": 0,
        "created_at": "2018-12-01T10:44:08.035344Z",
        "status": "p",
        "category": "ma",
        "author": "admin"
    }
]

Link: http://127.0.0.1:8000/api/answered_quiz/

Response: 200 OK
[
    {
        "id": 22,
        "title": "Logic And Math Quiz",
        "brief": "How does your brain cope with a healthy dose of lateral thinking?",
        "rating": 0,
        "created_at": "2018-12-01T10:44:08.035344Z",
        "status": "p",
        "category": "ma",
        "author": "admin"
    },
    {
        "id": 20,
        "title": "Logic And Math Quiz",
        "brief": "How does your brain cope with a healthy dose of lateral thinking?",
        "rating": 0,
        "created_at": "2018-12-01T10:44:07.788964Z",
        "status": "p",
        "category": "ma",
        "author": "admin"
    },
]
```