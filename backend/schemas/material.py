def materialEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "Material Type": item["Material Type"],
        "Identity": item["Identity"],
        "Material Name": item["Material Name"],
        "Elastic Modulus Values": item["Elastic Modulus Values"],
        "Poissons Ratio Values": item["Poissons Ratio Values"],
        "Shear Modulus Values": item["Shear Modulus Values"],
        "Mass Density Values": item["Mass Density Values"],
        "Yield  Strength Values": item["Yield  Strength Values"]
    }

def materialsEntity(entity) -> list:
    return [materialEntity(item) for item in entity]