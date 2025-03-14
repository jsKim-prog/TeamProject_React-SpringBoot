package com.project.it.service;

import com.project.it.domain.InfoPartners;
import com.project.it.dto.InfoPartnersDTO;
import com.project.it.dto.PageRequestDTO;
import com.project.it.dto.PageResponseDTO;
import com.project.it.repository.InfoPartnersRepository;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class InfoPartnersServiceImpl implements InfoPartnersService{
    private final InfoPartnersRepository partnersRepository;
    private final ModelMapper modelMapper;

    private final String category = "partners";

    @Override  //C: 고객사 등록
    public Long register(InfoPartnersDTO infoPartnersDTO) {
        log.info("(Service)고객사 정보 등록-----------:"+infoPartnersDTO);
        //dto -> entity
        InfoPartners infoPartners = modelMapper.map(infoPartnersDTO, InfoPartners.class);
        InfoPartners saveInfo = partnersRepository.save(infoPartners);
        return saveInfo.getCno();
    }

    @Override  //R_one: 고객사 정보 불러오기
    public InfoPartnersDTO getOne(InfoPartnersDTO infoPartnersDTO) {
        log.info("(Service)고객사 정보 불러오기-----------:"+infoPartnersDTO);
        InfoPartners findPartner = partnersRepository.searchPartners(infoPartnersDTO.getComName(), infoPartnersDTO.getPhone());
        //entity->dto
        InfoPartnersDTO partnersDTO = modelMapper.map(findPartner, InfoPartnersDTO.class);
        return partnersDTO;
    }

    @Override  //R_all : 고객사 리스트 불러오기(+paging)
    public PageResponseDTO<InfoPartnersDTO> getList(PageRequestDTO pageRequestDTO) {
        Pageable pageable = PageRequest.of(pageRequestDTO.getPage()-1, pageRequestDTO.getSize(), Sort.by("comName").ascending());

        Page<InfoPartners> result = partnersRepository.findAll(pageable);
        List<InfoPartnersDTO> dtoList = result.getContent().stream().map(infoPartners -> modelMapper.map(infoPartners, InfoPartnersDTO.class)).collect(Collectors.toList());
        long totalCount = result.getTotalElements();

        PageResponseDTO<InfoPartnersDTO> responseDTO = PageResponseDTO.<InfoPartnersDTO>withAll().dtoList(dtoList).pageRequestDTO(pageRequestDTO).totalCount(totalCount).build();
        return responseDTO;
    }

    @Override  //U : 고객사 정보 변경
    public void update(InfoPartnersDTO infoPartnersDTO) {
        //entity 조회 -> dto의 내용으로 entity 변경 -> entity save
        InfoPartners findPartner = partnersRepository.findById(infoPartnersDTO.getCno()).orElseThrow(EntityExistsException::new);
        findPartner.changeComName(infoPartnersDTO.getComName());
        findPartner.changeCoNum(infoPartnersDTO.getCoNum());
        findPartner.changePhone(infoPartnersDTO.getPhone());
        findPartner.changeSite(infoPartnersDTO.getSite());
        findPartner.changeAddress(infoPartnersDTO.getAddress());
        findPartner.changeBizType(infoPartnersDTO.getBizType());
        partnersRepository.save(findPartner);
    }

    @Override //D : 고객사 삭제
    public void remove(Long cno) {
        partnersRepository.deleteById(cno);
    }
}
