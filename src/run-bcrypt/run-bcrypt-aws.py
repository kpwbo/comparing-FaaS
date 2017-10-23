from locust import HttpLocust, TaskSet, task

class WebsiteTasks(TaskSet):
    @task
    def bcrypt(self):
        headers = { "Content-type": "application/json" }
        payload = '{"message":"hello world"}'
        self.client.post("/log8430-bcrypt", payload, headers = headers)
        
class WebsiteUser(HttpLocust):
    task_set = WebsiteTasks
    min_wait = 1
    max_wait = 1
