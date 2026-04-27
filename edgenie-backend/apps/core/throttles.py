from rest_framework.throttling import UserRateThrottle

class AIRateThrottle(UserRateThrottle):
    rate = '20/minute'
