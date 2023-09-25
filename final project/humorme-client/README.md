# rate-feature-appstore
---
This repository contains the code for presenting Rate Features for mobile apps in a web application.

### Implementation 

The implementation consists of the following architecture:

1. Frontend 
  - Users interact with the web app using a link in their browser.
  
 2. Backend 
  - The backend logic contains NextJS server side implementation that connects with Firebase database to store user interactions.
  
  ### What do we track?
  
  `What do we track through this app?` is a valid question that our users should be familiar with. The main goal of this app is to provide an experiment environment for App Rate Features and help us evaluate whether such features alter user behaviors. When we say `alter user behaviour`, we want to clarify that we only track following user interactions. 
  
| User interactions | Goal | App locations | 
| --- | --- | --- |
| Time spent | Does our feature help user achieve their goal faster ? |  |
| Usability | Is it easier to access our feature or existing feature in the app store ? | | 
| Quality of reviews | Do users leave quality reviews about the apps? | |

