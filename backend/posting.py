def post_to_platform(platform, content):
    """
    This function contains the real posting logic
    to the social media.
    It should return True on success and False on failure
    Will be simulated for now
    """

    print(f'Simulating posting stuff to {platform}')
    print(f'Content: {content}')
    import random
    if random.random() > 0.2:
        print("Success")
        return True
    else:
        print("Failed")
        return False