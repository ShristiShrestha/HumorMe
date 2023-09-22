-- PLACE JSON

create table places (
    id varchar(255) unique primary key,
    name varchar(255),
    claimed boolean,
    labels varchar(255),
    about longtext,
    last_updated timestamp,
    avg_rating float,
    num_reviews integer
);

create table addresses(
     street varchar(255),
     city varchar(255),
     state varchar(255),
     country varchar(255),
     zipcode integer,
     foreign key(place_id) references places(id),
);

create table amenity(
    name varchar(255),
    available boolean,
    foreign key(place_id) references places(id),
);

create table hours(
    day varchar(255),
    time varchar(255),
    foreign key(place_id) references places(id),
);

create table reviews(
    id varchar(255) unique primary key,
    user varchar(255),
    star_rating integer,
    text longtext
);

create table place_reviews(
     id varchar(255) unique primary,
     foreign key(place_id) references places(id),
     foreign key(review_id) references reviews(id),
);

-- MOVIE JSON

create table movies(
    id varchar(255) unique primary,
    title varchar(255),
    director varchar(255),
    budget varchar(255),
    release_date timestamp,
    review varchar(255)
);

create table genres(
    name varchar(255),
    foreign key(place_id) references movies(id),
);

create table actors(
    id varchar(255) unique primary,
    name varchar(255),
    url varchar(255)
);

create table movie_actors(
    id varchar(255) unique primary,
    foreign key(movie_id) references movies(id),
    foreign key(actor_id) references actors(id),
);

create table studios(
    id varchar(255) unique primary,
    name varchar(255),
);

create table movie_studio(
    id varchar(255) unique primary,
     foreign key(movie_id) references movies(id),
     foreign key(studio_id) references studios(id),
);