from abc import ABC, abstractmethod

class IAService(ABC):
    @abstractmethod
    def text_to_sql(self, prompt)->str:
        pass 

    @abstractmethod
    def predict(self, prompt)->str:
        pass