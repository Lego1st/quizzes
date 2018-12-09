# Quizzes backend API
**Changelog:** 
- Add `created_at` field to UserSubmission model
- Add `mark` and `submitted_at` to the response of `answered_quiz` api
- Add ordering filter with submission date to `answered_quiz` api
- Remove constrain `null=True` from `Quiz.created_date`, to migrate the existing database, select option `Provide a one-off default now` and add value `timezone.now`
## Quiz and Question APIs
List APIs:
- [Quiz item list APIs](#quizitemlistapi):
    - [`api/recent_quiz/`](#apirecent_quiz)
    - [`api/posted_quiz/`](#apiposted_quiz)
    - [`api/quiz_category/<cate>/`](#apiquiz_categorycate)
    - [`api/answered_quiz/`](#apianswered_quiz)
    - [`api/liked_quiz/`](#apiliked_quiz)

- [`api/quiz_question/<quiz_id>/`](#apiquiz_questionquiz_id)
- [`api/full_quiz/<quiz_id>/`](#apifull_quizquiz_id)
- [`api/create_quiz/`](#apicreate_quiz)
- [`api/submit_quiz/`](#apisubmit_quiz)
- [`api/quiz_result/<quiz_id>/`](#apiquiz_resultquiz_id)
- [`api/like_quiz/<quiz_id>/`](#apilike_quizquiz_id)

### Quiz item list APIs
**Method:** `GET`

**Descriptions:** Get a list of quiz item

**Parameters:**
- `page`: int, page index, start from 1
- `page_size`: int, number of items to response per page, default is `10`
- `username`: string, if not specified, will be default to the current user, ***only available for `posted_quiz`, `answered_quiz`, `liked_quiz`***

**Response:**
- `count`: int, the number of quiz items available
- `next`: link, the link of the next page for pagination, `null` if there is no next page
- `previous`: link, the link of the previous page for pagination, `null` if there is no previous page
- `result`: array, array of quiz items
    - `id`: int, quiz's id`
    - `title`: string
    - `brief`: string
    - `category`: string, options: ('ma', 'cs')
    - `rating`: int, quiz's difficulty, options: (1(easy), 2(medium), 3(hard))
    - `author`: string, username of the quiz's author`
    - `created_at`: date
    - `status`: string
    - `like_count`: int, number of likes this quiz recieved
    - `liked`: boolean, indicate whether the current user liked the quiz or didn't

#### `api/recent_quiz/`
**Descriptions:** Get a list of most recent quiz

Example:
```
Link: http://127.0.0.1:8000/api/recent_quiz/?page_size=2&page=2

Response: 200 OK
{
    "count": 22,
    "next": "http://127.0.0.1:8000/api/recent_quiz/?page=3&page_size=2",
    "previous": "http://127.0.0.1:8000/api/recent_quiz/?page_size=2",
    "results": [
        {
            "id": 20,
            "title": "Logic And Math Quiz",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:07.788964Z",
            "status": "p",
            "category": "ma",
            "author": "admin",
            "like_count": 0,
            "liked": false
        },
        {
            "id": 19,
            "title": "How logical are you?",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:07.705688Z",
            "status": "p",
            "category": "lg",
            "author": "admin",
            "like_count": 0,
            "liked": false
        }
    ]
}
```

#### `api/posted_quiz/`
**Descriptions:** Response a list of quiz that is created by an user

Example:
```
Link: http://127.0.0.1:8000/api/posted_quiz/?page_size=2&page=1

Response: 200 OK
{
    "count": 0,
    "next": null,
    "previous": null,
    "results": []
}

Link: http://127.0.0.1:8000/api/posted_quiz/?page_size=2&page=1&username=admin

Response: 200 OK
{
    "count": 22,
    "next": "http://127.0.0.1:8000/api/posted_quiz/?page=2&page_size=2&username=admin",
    "previous": null,
    "results": [
        {
            "id": 22,
            "title": "Logic And Math Quiz",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:08.035344Z",
            "status": "p",
            "category": "ma",
            "author": "admin",
            "like_count": 1,
            "liked": true
        },
        {
            "id": 21,
            "title": "How logical are you?",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:07.951632Z",
            "status": "p",
            "category": "lg",
            "author": "admin",
            "like_count": 0,
            "liked": false
        }
    ]
}
```

#### `api/quiz_category/<cate>/`
**Descriptions:** Get a list of most recent in a category

Example:
```
Link: http://127.0.0.1:8000/api/quiz_category/ma/?page_size=2&page=2

Response: 200 OK
{
    "count": 11,
    "next": "http://127.0.0.1:8000/api/quiz_category/ma/?page=3&page_size=2",
    "previous": "http://127.0.0.1:8000/api/quiz_category/ma/?page_size=2",
    "results": [
        {
            "id": 18,
            "title": "Logic And Math Quiz",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:07.576288Z",
            "status": "p",
            "category": "ma",
            "author": "admin",
            "like_count": 0,
            "liked": false
        },
        {
            "id": 16,
            "title": "Logic And Math Quiz",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:07.324084Z",
            "status": "p",
            "category": "ma",
            "author": "admin",
            "like_count": 0,
            "liked": false
        }
    ]
}
```

#### `api/answered_quiz/`
**Descriptions:** Get a list of quizzes done by user

Example:
```
Link: http://127.0.0.1:8000/api/answered_quiz/?username=admin&page_size=2&page=1

Response: 200 OK
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 22,
            "title": "Logic And Math Quiz",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:08.035344Z",
            "status": "p",
            "category": "ma",
            "author": "admin",
            "like_count": 1,
            "liked": true
        }
    ]
}

Link: http://127.0.0.1:8000/api/answered_quiz/?page_size=2&page=1

Response: 200 OK
{
    "count": 4,
    "next": "http://127.0.0.1:8000/api/answered_quiz/?page=2&page_size=2",
    "previous": null,
    "results": [
        {
            "id": 22,
            "title": "Logic And Math Quiz",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:08.035344Z",
            "status": "p",
            "category": "ma",
            "author": "admin",
            "like_count": 1,
            "liked": true
        },
        {
            "id": 20,
            "title": "Logic And Math Quiz",
            "brief": "How does your brain cope with a healthy dose of lateral thinking?",
            "rating": 0,
            "created_at": "2018-12-01T10:44:07.788964Z",
            "status": "p",
            "category": "ma",
            "author": "admin",
            "like_count": 0,
            "liked": false
        }
    ]
}
```

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
- `like_count`: int, number of likes this quiz recieved
- `liked`: boolean, indicate whether the current user liked the quiz or didn't
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
- `like_count`: int, number of likes this quiz recieved
- `liked`: boolean, indicate whether the current user liked the quiz or didn't
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

### `api/like_quiz/<quiz_id>/`
**Method:** `PUT`

**Description:** Use for liking or unliking a quiz, like if the user hasn't like the quiz, otherwise unlike.

**Parameters:** None

**Response:** It is recommended to use `like_count` in the response to update number of likes in the front-end, and if the user successfully like the quiz, `liked` should be `true`
- `id`: int, quiz's id`
- `title`: string
- `brief`: string
- `category`: string, options: ('ma', 'cs')
- `rating`: int, quiz's difficulty, options: (1(easy), 2(medium), 3(hard))
- `author`: string, username of the quiz's author`
- `created_at`: date
- `status`: string
- `like_count`: int, number of likes this quiz recieved
- `liked`: boolean, indicate whether the current user liked the quiz or didn't

Example:
```
Link: http://127.0.0.1:8000/api/like_quiz/12/

Response: 200 OK
{
    "id": 12,
    "title": "Logic And Math Quiz",
    "brief": "How does your brain cope with a healthy dose of lateral thinking?",
    "rating": 0,
    "created_at": "2018-12-01T10:44:06.884720Z",
    "status": "p",
    "category": "ma",
    "author": "admin",
    "like_count": 1,
    "liked": true
}
```