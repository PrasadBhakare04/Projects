package com.prasad.ecomBackend.service;

import com.prasad.ecomBackend.model.Product;
import com.prasad.ecomBackend.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    ProductRepo repo;

    public List<Product> getAllProducts(){
        return repo.findAll();
    }

    public Product getProduct(int id){
        return repo.findById(id).orElse(null);
    }
}
