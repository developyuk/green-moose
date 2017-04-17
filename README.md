# GREEN MOOSE
`Green Mooose` adalah sebuah layanan news/content aggregation (pengumpul berita / konten). 

> Better documentation at https://goo.gl/iY3Qrk

Another look a like service:
- line today / line feed
- feedly
- flipboard

## What we will be learning
- Microservices
- Infrastructure enginering using docker[^dockercompose]
- Vuejs[^vuejs] as frontend
- RPC / REST API
- Git flow[^gitflow]

## Requirement
### version 0.3
`Green Mooose` is microservices [^dockercompose], consist of:

- Metadata parser [^micrometa]
Parse site for news/content 
- Backend API 
	- Parse site news/content metadata to database
	- Call metadata parser on certain period (every 12hour / every 24hour) (RPC / REST)

###  version 1.0
- Update backend API to serve parsed news/content from DB to the frontend (RPC / REST)
- Frontend[^vuejs]
	- Feedly / flipboard like
	- No login, no source management, view only

### version 1.2
- Add related news/content feature 
	- Calculated from metadata and content summary
	- Update frontend to include related news/content`


### version 1.4
- Add source content management feature
	- add source content
	- delete source content

### version 1.5
- Add login feature[^jwt]

## Help and Support
- google.com
- stackoverflow.com
- deye.slack.com 

[^docker]: [Docker](https://docs.docker.com/) is the infrastructure independent platform that easily integrates into your existing environment and provides full stack portability for apps to run on today and tomorrow’s infrastructure.

[^dockercompose]: [Docker Compose](https://docs.docker.com/compose/) is a tool for defining and running multi-container Docker[^docker] applications

[^micrometa]: [Micrometa](https://github.com/jkphl/micrometa) ([demo](https://github.com/jkphl/micrometa)). A meta parser for extracting micro information out of HTML documents, currently supporting Microformats 1+2, HTML Microdata and JSON-LD, written in PHP

[^jwt]: [JSON Web Tokens](https://jwt.io/) are an open, industry standard RFC 7519 method for representing claims securely between two parties.

[^vuejs]: [Vue](https://vuejs.org/) is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable

[^gitflow]: [Git Flow](http://nvie.com/posts/a-successful-git-branching-model/) Git extensions to provide high-level repository operations for Vincent Driessen's branching model