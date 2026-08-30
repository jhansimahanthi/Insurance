package com.insurance.common.event;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class CustomerRegisteredEvent extends BaseEvent {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    public static CustomerRegisteredEvent create(Long userId, String firstName, String lastName, String email, String phone) {
        CustomerRegisteredEvent event = new CustomerRegisteredEvent();
        event.setUserId(userId);
        event.setFirstName(firstName);
        event.setLastName(lastName);
        event.setEmail(email);
        event.setPhone(phone);
        event.setEventType("CUSTOMER_REGISTERED");
        event.initDefaults();
        return event;
    }
}
