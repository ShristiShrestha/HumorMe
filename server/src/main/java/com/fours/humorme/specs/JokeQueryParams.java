package com.fours.humorme.specs;

import com.fours.humorme.model.Joke;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JokeQueryParams {
    public Long userId;
    public String text;

    public Specification searchSpecs(){
        return Specification.where(new LikeText()).and(new WithUser());
    }

   class LikeText implements Specification<Joke>{

       @Override
       public Predicate toPredicate(Root<Joke> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
           try{
               if(text != null && text.length() > 0){
                   Predicate matchText = criteriaBuilder.like(criteriaBuilder.lower(root.get("text")), "%"+text+"%");
                   Predicate matchLabel = criteriaBuilder.like(criteriaBuilder.lower(root.get("labels")), "%"+text+"%");
                   Predicate matchUser = criteriaBuilder.like(criteriaBuilder.lower(root.get("user").get("name")),"%"+text+"%");
                   return criteriaBuilder.or(matchText, matchLabel, matchUser);
               }
           }catch (Exception ex){

           }
           return null;
       }
   }

    class WithUser implements Specification<Joke>{

        @Override
        public Predicate toPredicate(Root<Joke> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
            try{
                if(userId != null){
                    return criteriaBuilder.equal(root.get("user").get("id"), userId);
                }
            }catch (Exception ex){

            }
            return null;
        }
    }
}
