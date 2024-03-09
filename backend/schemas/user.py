def userEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "name": item["name"],
        "email": item["email"],
        "collegeName": item["collegeName"],
        "phoneNumber": item["phoneNumber"],
        "password": item["password"],
        "useFor": item["useFor"],
        "isFreeTrialOver": item["isFreeTrialOver"],
        "isSubscribed": item["isSubscribed"]
    }

def usersEntity(entity) -> list:
    return [userEntity(item) for item in entity]