from pydantic import BaseModel

class Feedback(BaseModel):
    needsMet: str
    paymentEase: str
    serviceSatisfaction: str
    recommendLikelihood: str
    navigationEase: str
    speedSatisfaction: str
    infoClarity: str
    overallExperience: str
    additionalComments: str
