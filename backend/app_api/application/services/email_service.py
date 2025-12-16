from abc import ABC, abstractmethod

class EmailService(ABC):
    @abstractmethod
    def send_email(self, email, subject, message)-> bool:
        pass