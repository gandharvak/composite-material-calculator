def feedbackEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "needsMet": item['needsMet'],
        "paymentEase": item['paymentEase'],
        "serviceSatisfaction": item['serviceSatisfaction'],
        "recommendLikelihood": item['recommendLikelihood'],
        "navigationEase": item['navigationEase'],
        "speedSatisfaction": item['speedSatisfaction'],
        "infoClarity": item['infoClarity'],
        "overallExperience": item['overallExperience'],
        "additionalComments": item['additionalComments']
    }

def feedbackEntities(entities) -> list:
    return [feedbackEntity(item) for item in entities]
