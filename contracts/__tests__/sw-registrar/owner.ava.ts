import { NEAR } from 'near-workspaces-ava';
import { initWorkSpace, assertFailure } from './helper';

const workspace = initWorkSpace();

workspace.test('set_owner', async (test, {contract, owner, alice, bob}) => {
    let md = await contract.view('metadata');
    // console.log(md);
    // test.is(
    //   (await contract.view('metadata', { account_id: alice }) as any).user_count,
    //   '0',
    // );
    test.deepEqual(md, {
      version: '1.0.0',
      owner_id: owner.accountId,
      operators: [],
      user_count: '0'
    });

    await owner.call(contract, 'set_owner', {owner_id: alice});

    test.is(
      (await contract.view('metadata') as any).owner_id,
      alice.accountId,
    );
    
    await alice.call(contract, 'set_owner', {owner_id: bob});

    test.is(
      (await contract.view('metadata') as any).owner_id,
      bob.accountId,
    );

    await bob.call(contract, 'set_owner', {owner_id: owner});

    test.is(
      (await contract.view('metadata') as any).owner_id,
      owner.accountId,
    );
  });

  workspace.test('manage_operators', async (test, {contract, owner, alice, bob}) => {
    await owner.call(contract, 'extend_operators', {operators: [alice, bob]});
    
    test.deepEqual(
      (await contract.view('metadata') as any).operators,
      [alice.accountId, bob.accountId],
    );

    await owner.call(contract, 'remove_operators', {operators: [bob]});

    test.deepEqual(
      (await contract.view('metadata') as any).operators,
      [alice.accountId],
    );
  });

  workspace.test('owner_register_new_user', async (test, {contract, owner, alice, bob}) => {
    await owner.call(
      contract, 
      'register_new_user', 
      {accound_id: alice, user_name: 'alice@senderwallet'},
      { attachedDeposit: NEAR.parse('0.1') },
    );

    test.is(
      (await contract.view('metadata') as any).user_count,
      '1',
    );

    const ui = await contract.view('get_user_info', { account_id: alice });
    // console.log(ui);
    test.is((ui as any).account_id, alice.accountId);
    test.is((ui as any).user_name, 'alice@senderwallet');

    const nothing = await contract.view('get_user_info', { account_id: bob });
    test.is(nothing, null);
  });