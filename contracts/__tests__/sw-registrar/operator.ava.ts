import { NEAR } from 'near-workspaces-ava';
import { initWorkSpace, assertFailure } from './helper';

const workspace = initWorkSpace();

workspace.test('operator_register_new_user', async (test, {contract, owner, alice, bob}) => {
    
    await owner.call(contract, 'extend_operators', {operators: [bob]});

    await bob.call(
      contract, 
      'register_new_user', 
      {accound_id: alice, user_name: 'alice@senderwallet'},
      { attachedDeposit: NEAR.parse('0.1') },
    );

    test.is(
      (await contract.view('metadata') as any).user_count,
      '1',
    );

    const ui_alice = await contract.view('get_user_info', { account_id: alice });
    test.is((ui_alice as any).account_id, alice.accountId);
    test.is((ui_alice as any).user_name, 'alice@senderwallet');

    const nothing = await contract.view('get_user_info', { account_id: bob });
    test.is(nothing, null);

    await bob.call(
        contract, 
        'register_new_user', 
        {accound_id: bob, user_name: 'bob@senderwallet'},
        { attachedDeposit: NEAR.parse('0.1') },
      );
  
    test.is(
      (await contract.view('metadata') as any).user_count,
      '2',
    );

    let ui_bob = await contract.view('get_user_info', { account_id: bob });
    test.is((ui_bob as any).account_id, bob.accountId);
    test.is((ui_bob as any).user_name, 'bob@senderwallet');
  });