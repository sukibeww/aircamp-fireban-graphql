# Fireban API for Aircamper

## Objective

To create an API that provides fire ban status and fire danger rating provided by the local government website.

* [CFA for VIC](https://www.cfa.vic.gov.au/home)
* [RFS for NSW](https://www.rfs.nsw.gov.au/)
* [Ruralfire for QLD](https://www.ruralfire.qld.gov.au/Pages/Home.aspx)

## Stack
* Javascript
* MongoDB
* Mongoose
* GraphQL
* Docker
* Node.js
* Express.js

## Breakdown

The application functionality is seperated into 2 part, the functionality to retrieved the information from above mentioned government website and the functionality to return retrieved information using GraphQL query. 

### Retrieve endpoints

* POST, http://localhost:5000/cfa
* POST, http://localhost:5000/rsa
* POST, http://localhost:5000/ruralfire

### GraphQL endpoints

* POST, http://localhost:5000/

![Graphiql](https://user-images.githubusercontent.com/42060507/71462677-2a22e200-2808-11ea-9ecb-7816631757e6.png)


## Challanges
---
#### Inconsistent structure and data

All of the above mentioned website have a different way of storing the information, some types of information is only provided by a particular website while other sources does not provide such information.

#### HTTP version ( ? )

I stumbled into a weird problem while trying to retrieve information from [Ruralfire](https://www.ruralfire.qld.gov.au/Pages/Home.aspx). I had to go through bunch of stackoverflow and github discussion regarding this problem. Turns out that it has something to do with node's http engine is not backward compatible. I had to containerize this project with docker in a Node v.10 image in order to enforce version of node that is compatible with this website.

## Justifications

#### Why MongoDB ? 

I started this project knowing that I have to go through a lot of weird and inconsistent data, with that in mind I knew that I have to use NoSQL database and I just happened to be familiar with MongoDB and Mongoose ODM.

#### Why GraphQL ?

I started this project without knowing what kind of information that is deemed necessary and which are not, also as I mentioned before the provided information is inconsistent. I thought this is a good scenario for a GraphQL because it is super easy to modify the schema and query based on the actual use case down the road. 

----

### Made with ❤️ and ☕  Thank you for reading my README 😀
