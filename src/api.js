// const API_BASE = 'http://localhost/api';
const API_BASE = 'https://tnsltu.in/api';

export async function loginAPI(email, password) {
  try {
    const response = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getProfileAPI(token) {
  try {
    const response = await fetch(`${API_BASE}/profile.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getUserStats(token) {
  try {
    const res = await fetch(`${API_BASE}/stats.php`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  } catch (err) {
    return { status: 500, message: 'Error fetching stats' };
  }
}

export async function registerAPI(userData, token) {
  try {
    const response = await fetch(`${API_BASE}/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}


export async function getAllUsers(token) {
  try {
    const response = await fetch(`${API_BASE}/get_users.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}


export async function getUserById(id, token) {
  try {
    const response = await fetch(`${API_BASE}/get_user_by_id.php?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export const updateUser = async (userData, token) => {
  const res = await fetch(`${API_BASE}/update_user.php?id=${userData?.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return await res.json();
};

export const deleteUser = async (id, token) => {
  const res = await fetch(`${API_BASE}/delete_user.php?id=${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
};






export async function getAllIdCards(token) {
  try {
    const response = await fetch(`${API_BASE}/fetch_id_cards.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}







export async function saveIdCardDetails (id, data, token) {
  try {
    const response = await fetch(`${API_BASE}/save_id_details.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id, ...data }),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}




export async function downloadIdCard (data, token) {
  try {
    const response = await fetch(`${API_BASE}/generate_id_card.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data }),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getAllFamilyMembers(token) {
  try {
    const response = await fetch(`${API_BASE}/get_family_members.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function saveFamilyMemberDetails(userId, data, token) {
  try {
    const payload = {
      user_id: userId,         // head user id
      ...data             // may already contain family_id if editing
    };

    const response = await fetch(`${API_BASE}/save_family_member.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    console.error("saveFamilyMemberDetails error:", err);
    return { status: 500, message: "Network error" };
  }
}


export async function getUsersWithFamily(id, token) {
  try {
    const response = await fetch(`${API_BASE}/get_users_with_family.php?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getAllClaims(token) {
  try {
    const response = await fetch(`${API_BASE}/get_claims.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function updateClaimStatus(payload, token) {

  try {
    const response = await fetch(`${API_BASE}/update_claim_status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}




export async function deleteFamilyMember(memberId, token) {
  try {
    const response = await fetch(`${API_BASE}/delete_family_member.php?id=${memberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}


export async function addEnquiry(data) {
  try {
    const response = await fetch(`${API_BASE}/add_enquiry.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getAllEnquiries(token) {
  try {
    const response = await fetch(`${API_BASE}/get_enquiries.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function changeStatus(enquiryId, payload, token) {
  console.log("changeStatus called with:", enquiryId, payload, token);
  try {
    const response = await fetch(`${API_BASE}/change_enquiry_status.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id: enquiryId, ...payload }),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function updateEnquiry(enquiryId, payload) {
  try {
    const response = await fetch(`${API_BASE}/update_enquiry.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: enquiryId, ...payload }),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getNotifications(token) {
  console.log("Fetching notifications with token:", token);
  try {
    const response = await fetch(`${API_BASE}/get_notifications.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function createNotification(data, token) {
  console.log("Creating notification with data:", data, "and token:", token);

  try {
    const isFormData = data instanceof FormData;

    const response = await fetch(`${API_BASE}/create_notification.php`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        // ❌ Don't set Content-Type when sending FormData
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
      body: isFormData ? data : JSON.stringify(data),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    console.error("Network error in createNotification:", err);
    return { status: 500, message: 'Network error' };
  }
}
 
export async function deleteNotification(id, token) {
  try {
    const response = await fetch(`${API_BASE}/delete_notification.php?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getDistrictMembers(district) {
  try {
    const response = await fetch(`${API_BASE}/get_district_details.php?district=${district}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}


export async function changePasswordAPI(data, token) {
  try {
    const response = await fetch(`${API_BASE}/change_password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function createOrderAPI(data, token) {
  try {
    const response = await fetch(`${API_BASE}/create_order.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getOrdersByUserAPI(userId, token) {
  try {
    const response = await fetch(`${API_BASE}/get_orders_by_user.php?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function deleteOrderAPI(orderId, token) {
  try {
    const response = await fetch(`${API_BASE}/delete_order.php?order_id=${orderId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function getAllOrdersAPI(token) {
  try {
    const response = await fetch(`${API_BASE}/get_orders.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export async function updateOrderStatusAPI(payload, token) {
  try {
    const response = await fetch(`${API_BASE}/update_order_status.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}

export const getUpcomingNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE}/getUpcomingNotifications.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await response.json();
    return res;
  } catch (err) {
    return { status: 500, message: 'Network error' };
  }
}