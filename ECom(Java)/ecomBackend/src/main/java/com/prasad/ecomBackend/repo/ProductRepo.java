package com.prasad.ecomBackend.repo;


import com.prasad.ecomBackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<Product, Integer>{
}
