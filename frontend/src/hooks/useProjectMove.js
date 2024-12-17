// 페이지 넘어가는 기능을 한곳에 모아두기 위함.

import {useState} from "react"
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom"
import {deleteMemberAlarm, deleteProjectAlarm} from "../api/ProjectAlarmApi";

// getNum을 호출할때 파라미터, 기본값을 받아옴
const getParam = (param, defaultValue, isNumeric = false) => {
    if (!param) {
        return defaultValue; // 파라미터가 없으면 기본값 반환
    }
    return isNumeric ? parseInt(param) : param; // 숫자인 경우 int로 변환, 그렇지 않으면 원래 값 반환
};


const useProjectMove = () => {
    const navigate = useNavigate();
    // 현재 페이지를 다시 클릭하면 서버 호출을 하지않음,
    // 동일한 page, size더라도 매번 서버 호출하고 싶으면 매번 변하는 상태값을 이용해야함.
    // 즉 버튼 클릭시 true와 false 값이 번갈아 가면서 변경되거나, 숫자가 계속올라가거나, 현재시간등을 이용할수있음
    const [refresh, setRefresh] = useState(false)
    const [queryParams] = useSearchParams()
    const page = getParam(queryParams.get("page"), 1)
    const size = getParam(queryParams.get("size"), 10)
    const sort = getParam(queryParams.get("sort"), "")
    const order = getParam(queryParams.get("order"), "desc")
    const searchType = getParam(queryParams.get("searchType"), "")
    const searchText = getParam(queryParams.get("searchText"), "")

    // 디폴트 쿼리 page=1&size=10
    const queryDefault = createSearchParams({page, size, sort, order, searchType, searchText}).toString()

    // 목록으로 돌아가는 함수
    const moveToList = (pageParam) => {
        let queryStr
        const currentSort = queryParams.get("sort") || "pno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        const currentSearchType = queryParams.get("searchType") || "";
        const currentSearchText = queryParams.get("searchText") || "";
        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder,
                searchType: currentSearchType,
                searchText: currentSearchText,
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: "../project",
            search: queryStr,
        })
    }

    const moveToDeletedList = (pageParam) => {
        let queryStr;
        if (pageParam) { // pageParam이 있으면,
            // 파라미터 추출
            const pageNum = getParam(pageParam.page, 1)
            const sizeNum = getParam(pageParam.size, 10)
            const sort = getParam(pageParam.sort, "pno")
            // 하나로 합침
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: sort
            }).toString()
        } else { // pageParam없으면 기본값 1, 10
            queryStr = queryDefault
        }
        setRefresh(!refresh)
        navigate({
            pathname: "../project/deleted",
            search: queryStr,
        })
    }


    // 수정 화면으로 넘어가는 메서드
    const moveToModify = (id) => {
        console.log(queryDefault);
        navigate({
            pathname: `../project/modify/${id}`,
            search: queryDefault // 수정시 기존의 쿼리 스트링 유지를 위해
        })
    }

    // 조회 화면으로 넘어가는 메서드
    const moveToRead = (pno, mno) => {
        console.log(queryDefault)
        if(mno) {
        navigate({
            pathname: `../project/${pno}`,
            search: queryDefault
        })} else {
            alert("로그인 후 조회 가능합니다.")
        }

    }

    // 내프로젝트 조회로 이동
    const moveToMyList = (mno, pageParam) => {
        let queryStr;
        const currentSort = queryParams.get("sort") || "pno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc

        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: `../project/list/${mno}`,
            search: queryStr,
        })
    }

    // 이슈리스트로 이동
    const moveToIssueList = (pageParam) => {
        let queryStr;

        const currentSort = queryParams.get("sort") || "pno"; // 기본값으로 pno 사용
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc
        console.log("Received pageParam:", pageParam);
        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        setRefresh(!refresh)
        navigate({
            pathname: "../project/issue",
            search: queryStr,
        })
    }

    // 해당 프로젝트 이슈 리스트
    const moveToProjectIssueList = (pno, pageParam) => {

        let queryStr;


        let currentSort = queryParams.get("sort") || "ino"; // 기본값으로 pno 사용
        if (currentSort === "pno" || currentSort === "progress" || currentSort === "status") {
            currentSort = "ino"
        }
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc

        console.log("Received pageParam:", pageParam);
        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            console.log("pageNum:", pageNum, "sizeNum:", sizeNum);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        console.log("Navigating with query:", queryStr); // 쿼리 문자열 로그로 확인
        navigate({
            pathname: `../project/issue/${pno}`,
            search: queryStr,
        })
    }

    // 조회 화면으로 넘어가는 메서드
    const moveToIssueRead = (ino) => {
        deleteProjectAlarm(ino).then(data => {
            console.log(data);
        })
        navigate({
            pathname: `../project/issue/read/${ino}`,
            search: queryDefault

        })
    }

    // 조회 화면으로 넘어가는 메서드
    const moveToMyIssueRead = (ino) => {
        deleteMemberAlarm(ino).then(data => {
            console.log(data);
        })
        navigate({
            pathname: `../project/issue/read/${ino}`,
            search: queryDefault

        })
    }

    // 이슈 수정 페이지로 이동
    const moveToIssueModify = (ino) => {
        navigate({
            pathname: `../project/issue/modify/${ino}`
        })
    }
    
    // 프로젝트 참여 멤버 조회로 이동 
    const moveToProjectMember = (pno, isEditable) => {
        localStorage.setItem('isEditable', JSON.stringify(isEditable));
        // 새 탭으로 이동
        window.open(`../project/member/${pno}`, '_blank', 'width=1200,height=1200,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes');
    }

    // 일정 관리로 이동
    const moveToCalendar = (pno, isProjectMember) => {
        localStorage.setItem('isProjectMember', JSON.stringify(isProjectMember));
        // 새 탭으로 이동
        window.open(
            `../calendar/${pno}`,
            '_blank',
            'width=1200,height=1200,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes'
        );
    }

    // 프로젝트 고객사 정보로 이동
    const moveToProjectPartner = () => {
        window.open(`/partners/register/blank`, '_blank', 'width=600,height=900,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no');
    }

    // 프로젝트 고객사 수정으로 이동
    const moveToProjectPartnerUpdate = (pno) => {
        navigate({
            pathname: `../project/partner/update/${pno}`
        })
    }


    const moveToProjectIssueNullList = (pno, pageParam) => {

        let queryStr;


        let currentSort = queryParams.get("sort") || "ino"; // 기본값으로 pno 사용
        if (currentSort === "pno" || currentSort === "progress" || currentSort === "status") {
            currentSort = "ino"
        }
        const currentPage = queryParams.get("page") || 1; // 기본값으로 1 사용
        const currentSize = queryParams.get("size") || 10; // 기본값으로 10 사용
        const currentOrder = queryParams.get("order") || "desc"; // 기본값으로 desc

        console.log("Received pageParam:", pageParam);
        if (pageParam) {
            // pageParam에서 값을 가져오고, 기존 쿼리 파라미터 값 사용
            const pageNum = getParam(pageParam.page, currentPage);
            const sizeNum = getParam(pageParam.size, currentSize);
            console.log("pageNum:", pageNum, "sizeNum:", sizeNum);
            // 기존의 sort 값을 유지
            queryStr = createSearchParams({
                page: pageNum,
                size: sizeNum,
                sort: currentSort,
                order: currentOrder
            }).toString();
        } else {
            // pageParam이 없으면 기본값 사용
            queryStr = queryDefault;
        }
        console.log("Navigating with query:", queryStr); // 쿼리 문자열 로그로 확인
        navigate({
            pathname: `../project/issue/nulllist/${pno}`,
            search: queryStr,
        })
    }

    return (
        {
            moveToList,
            moveToModify,
            moveToDeletedList,
            moveToRead,
            moveToMyList,
            moveToIssueList,
            moveToIssueRead,
            moveToProjectIssueList,
            moveToIssueModify,
            moveToMyIssueRead,
            moveToProjectMember,
            moveToCalendar,
            moveToProjectPartner,
            moveToProjectPartnerUpdate,
            moveToProjectIssueNullList,
            page,
            size,
            sort,
            searchType,
            searchText,
        }
    );
}

export default useProjectMove;