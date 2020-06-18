package com.luv2code.ecommerce.entity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin
public interface ProductRepository extends JpaRepository<Product , Long> {

    Page<Product> findByCategoryId(@RequestParam("id") Long id , Pageable pageable);

    Page<Product> findByNameContaining(@RequestParam("name") String name , Pageable pageable);
}
